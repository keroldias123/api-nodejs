import { Server } from "./app.ts"

Server.listen({ port: 3000, host: '0.0.0.0' }, function (err, address) {
  if (err) {
    Server.log.error(err)
    process.exit(1)
  }
  Server.log.info(`server listening on ${address} docs: http://localhost:3000/docs`)
})