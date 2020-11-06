<template>
  <div class="dashboard">
    <Header />
    <div class="page-wrapper my-3">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-3">
            <h3>Channels</h3>
            <hr />
            <div class="card channels">
              <ul class="list-group list-group-flush">
                <li class="list-group-item" :class="channel.slug === currentChannel && 'active'" v-for="channel in this.channels" @click="handleChooseChannel(channel.slug)">
                  # {{ channel.name }}
                </li>
              </ul>
            </div>
          </div>
          <div class="col-lg-6">
            <h3>Messages</h3>
            <hr />
            <Chat :currentChannel="currentChannel" :socket="socket" />
          </div>
          <div class="col-lg-3">
            <h3>Members</h3>
            <hr />
            <ul class="members list-group list-group-flush">
              <li class="list-group-item" v-for="member in this.members">
                <div class="d-flex justify-content-between align-items-center">
                  <strong>{{ member.displayName }}</strong><br />
                  <div class="status" :class="member.isActive ? 'active' : 'inactive'"></div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Chat from "@/components/Chat";
import {db} from "@/api/firebase";
import socketClient from "socket.io-client";
import {mapState} from "vuex";

export default {
  name: "Dashboard",
  components: {Chat, Header},
  data() {
    return {
      socket: null,
      currentChannel: "general",
      channels: [],
      members: [],
    }
  },
  methods: {
    handleChooseChannel(channel) {
      this.currentChannel = channel;
    },
    initChannels() {
      this.socket = socketClient("https://pj-chat-server.herokuapp.com/");
      db.collection("channels").get().then(response => {
        let list = [];
        response.forEach(item => {
          list.push({
            id: item.id,
            ...item.data()
          })
        })
        this.channels = list;
        this.socket.emit("initChannels", list);
      })
    },
    initMembers() {
      db.collection("users").get().then(response => {
        let list = [];
        response.forEach(item => {
          list.push({
            uid: item.id,
            ...item.data(),
            isActive: false
          })
        })
        this.socket.emit("initMembers", list);
      })
    },
  },
  computed: {
    ...mapState([
      "user"
    ]),
  },
  created() {
    this.initChannels();
    this.initMembers()
  },
  mounted() {
    this.socket.emit("userJoin", this.user)
    this.socket.on("updateMembers", (members) => {
      this.members = members;
    });

    window.onbeforeunload = () => {
      this.socket.emit("userLeave", this.user)
      this.socket.on("updateMembers", (members) => {
        this.members = members;
      })
      this.socket.close();
    };
  },
  beforeRouteLeave (to, from, next) {
    const answer = window.confirm('Do you really want to leave?')
    if (answer) {
      this.socket.emit("userLeave", this.user)
      this.socket.on("updateMembers", (members) => {
        this.members = members;
      })
      this.socket.close();
      next();
    } else {
      next(false)
    }
  },
}
</script>
