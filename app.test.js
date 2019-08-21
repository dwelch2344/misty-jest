const { LightClient } = require('./lightClient')
const { LightSocket } = require('./lightSocket')

const ip = '172.20.10.6'
let socket = new LightSocket(ip, onOpen, onClose, onErr)
let client = new LightClient(ip, 3 * 1000)

beforeAll(() => {
  console.log('about to connect?')
  socket.Connect()
})

test('ok', async () => {
  jest.setTimeout(15000)

  await client.post('led', {
    red: 255,
    green: 255,
    blue: 255
  })

  const up = {
    arm: 'null',
    position: -30,
    velocity: 40,
    duration: 3000,
    units: 'null'
  }
  const down = {
    arm: 'null',
    position: 90,
    velocity: 40,
    duration: 3000,
    units: 'null'
  }

  await client.post('arms', { ...up, arm: 'left' })
  await client.post('arms', { ...up, arm: 'right' })

  await new Promise(res => setTimeout(res, 3 * 1000))

  await client.post('arms', { ...down, arm: 'left' })
  await client.post('arms', { ...down, arm: 'right' })

  console.log('sleep')
  await new Promise(res => setTimeout(res, 7 * 1000))

  const data = await client.get('device')
  console.log(data)
})

afterAll(() => {
  socket.Disconnect()
})

function onOpen() {
  console.log('Socket connection established')
}
function onClose() {
  // console.log('Socket connection closed')
}
function onErr(err) {
  console.log('Socket err', err)
}

function msg(command, event, message) {
  var message = {
    Operation: 'unsubscribe',
    EventName: 'CenterTimeOfFlight',
    Message: ''
  }

  return JSON.stringify(message)
}
