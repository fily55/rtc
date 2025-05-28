This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Install packages and then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Task

This is a very simple WebRTC frontend application.

This app has 2 video elements that are connected to a RTC peer connection. The user is publishing to themselves.

Once you start the app, you will see a "Start A/V" button. This will enable your devices.

After this you are able to start the RTC connection by clicking "Call". To end the call, simply click "Hang Up" and you will be back to square one.

Once you have activated your camera and microphone, you can mute and un mute both audio and video.

The app is using basic redux toolkit with `createAsyncThunk` to handle async code.

This app is not pretty. I decided not to have any icons or animation for a quick prototype.