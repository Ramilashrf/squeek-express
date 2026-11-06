import {startServer} from '../server/http.mjs';
const {server}=await startServer();console.log(`Squeek Express: http://localhost:${server.address().port}`);
