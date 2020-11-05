<template>
  <div class="chat">
    <ul class="messages list-group list-group-flush">
      <li class="list-group-item" v-for="message in this.getMessages">
        <div class="d-flex justify-content-between">
          <strong>{{ message.owner.nickName }}</strong><br />
          <small>{{ formatDate(message.dateTime) }}</small>
        </div>
        <p>
          {{ message.message }}
        </p>
      </li>
    </ul>
    <form @submit="handleSubmit">
      <div class="form-group">
        <label for="message">Message</label>
        <textarea
          name="message"
          class="form-control"
          id="message"
          placeholder="Type text..."
          @input="handleChange"
          v-model="message"
          @keypress.enter="handleSubmit"
        ></textarea>
      </div>
      <div class="text-right">
        <button
          type="submit"
          class="btn btn-primary"
        >
          Send message
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import {db} from "@/api/firebase";
import {mapState} from "vuex";
import _ from "lodash";

export default {
  name: "Chat",
  props: {
    currentChannel: String,
    socket: Object
  },
  data() {
    return {
      messages: [],
      message: "",
    }
  },
  methods: {
    loadChannel() {
      db.collection("messages").where("channel", "==", this.currentChannel).orderBy("dateTime", "desc").get().then(response => {
        let messages = [];
        response.forEach(item => {
          messages.push({
            message: item.data().message,
            owner: item.data().owner,
            dateTime: item.data().dateTime
          })
        })
        this.messages = messages;
        this.socket.emit("changeChannel", {user: this.user, channel: this.currentChannel, messages})
      })
    },
    handleChange(e) {
      this.message = e.target.value;
    },
    handleSubmit(e) {
      e.preventDefault();
      const message = {
        channel: this.currentChannel,
        dateTime: Date.now(),
        message: this.message,
        owner: this.user
      };
      db.collection("messages").add(message).then(response => {
        this.socket.emit("sendMessage", {message, channel: this.currentChannel})
        this.message = "";
      })
    },
    formatDate(date) {
      let obj = new Date(date);
      let dateFormatted = obj.toLocaleDateString("pl-PL");
      let timeFormatted = obj.toLocaleTimeString("pl-PL");

      return dateFormatted + " " + timeFormatted;
    }
  },
  computed: {
    ...mapState([
      "user"
    ]),
    getMessages() {
      return _.orderBy(this.messages, "dateTime", ["desc"]);
    }
  },
  watch: {
    currentChannel(newVal, oldVal) {
      this.messages = [];
      this.loadChannel(newVal);
    }
  },
  updated() {
    this.socket.on("updateMessages", ({channel, messages}) => {
      if(channel === this.currentChannel) {
        this.messages = messages;
      }
    })
  },
  mounted() {
    this.loadChannel();
  },
}
</script>
