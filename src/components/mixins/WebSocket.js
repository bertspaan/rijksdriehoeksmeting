import ReconnectingWebSocket from 'reconnecting-websocket'

export default {
  name: 'WebSocket',
  data() {
    return {
      rws: new ReconnectingWebSocket('wss://rijksdriehoeks.glitch.me/ws')
      // rws: new ReconnectingWebSocket('wss://bedecked-locket.glitch.me/ws')

      // rws: new ReconnectingWebSocket('ws://localhost:3000/')
    }
  },
  props: {
    url: {
      type: String
    }
  },
  methods: {
    wsSend: function (type, data) {
      const message = {
        type,
        timestamp: + new Date(),
        data
      }
      this.rws.send(JSON.stringify(message))
    }
  },
  created: function () {
    this.rws.addEventListener('open', () => {
      this.$emit('ws:open')
    })

    this.rws.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data)
        this.$emit('ws:message', message)
      } catch (err) {
        // console.error(err.message)
      }
    })
  }
}
