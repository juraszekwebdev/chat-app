<template>
  <div class="dashboard">
    <Header />
    <div class="page-wrapper my-3">
      <div class="container-fluid">
        <div class="row">
          <div class="col-sm-4 col-lg-3">
            <h3>Channels</h3>
            <hr />
            <div class="card channels">
              <ul class="list-group list-group-flush">
                <li class="list-group-item" :class="channel.slug === currentChannel && 'active'" v-for="channel in this.getChannels" @click="handleChooseChannel(channel.slug)">
                  # {{ channel.name }}
                </li>
              </ul>
            </div>
            <div class="d-block d-lg-none mt-3">
              <h3>Members</h3>
              <hr />
              <ul class="members list-group list-group-flush">
                <li class="list-group-item" v-for="member in this.getMembers">
                  <div class="d-flex justify-content-between align-items-center">
                    <strong>{{ member.nickname }}</strong><br />
                    <div class="status" :class="member.isActive ? 'active' : 'inactive'"></div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="col-sm-8 col-lg-6 mt-3 mt-sm-0">
            <h3>Messages</h3>
            <hr />
            <Chat :currentChannel="currentChannel" :socket="socket" />
          </div>
          <div class="col-sm-3 d-none d-lg-block">
            <h3>Members</h3>
            <hr />
            <ul class="members list-group list-group-flush">
              <li class="list-group-item" v-for="member in this.getMembers">
                <div class="d-flex justify-content-between align-items-center">
                  <strong>{{ member.nickname }}</strong><br />
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
import {io} from "socket.io-client";
import {mapState, mapActions} from "vuex";
import _ from "lodash"

export default {
  name: "Dashboard",
  components: {Chat, Header},
  data() {
    return {
      socket: io(process.env.NODE_ENV === "development" ? "http://localhost:3000/" : "https://pj-chat-server.herokuapp.com/"),
      currentChannel: "general",
    }
  },
  methods: {
    ...mapActions([
      "initChannelsData",
      "initMembersData",
      "updateMemberStatus"
    ]),
    handleChooseChannel(channel) {
      this.currentChannel = channel;
    },
    async initChannels() {
      return db.collection("channels").get().then(response => {
        console.debug("Initializing channels...");
        let list = [];
        response.forEach(item => {
          list.push({
            id: item.id,
            ...item.data()
          })
        })
        this.initChannelsData(list);
        console.debug("Channels initialized.");
      });
    },
    async initMembers() {
      return db.collection("users").get().then(response => {
        console.debug("Initializing members...");
        let list = [];
        response.forEach(item => {
          list.push({
            uid: item.id,
            ...item.data(),
            isActive: false,
            channel: 'general',
          })
        });
        this.initMembersData(list);
        console.debug("Members initialized.");
      });
    },
  },
  computed: {
    ...mapState([
      "user",
      "chat"
    ]),
    getMembers() {
      return this.chat.members;
    },
    getChannels() {
      return this.chat.channels;
    }
  },
  created() {
    console.debug('Created');
    this.initChannels().then(() => {
      this.initMembers().then(() => {
        this.socket.emit("joined", ({user: this.user, channel: this.currentChannel}));

      });
    });

    this.socket.on('updateMembers', members => {
      members.forEach(member => {
        this.updateMemberStatus({user: member, status: member.isActive});
      })
    });

    window.onbeforeunload = () => {
      this.socket.emit('leave', this.user);
    }
  },
  beforeRouteLeave (to, from, next) {
      this.socket.emit('leave', this.user);
      next();
  },
}
</script>
