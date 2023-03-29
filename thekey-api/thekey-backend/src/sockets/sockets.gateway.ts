import { OnEvent } from '@nestjs/event-emitter';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PostCreatedEvent } from '../events/post-created.event';
import { PostWordsUpdatedEvent } from '../events/post-words-updated.event';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketsGateway {
  @WebSocketServer()
  public server: Server;

  broadcastMessage(channel: string, message: any) {
    this.server.sockets.emit(channel, message);
  }

  @OnEvent('post_words_updated')
  handlePostWordsUpdatedEvent(postWords: PostWordsUpdatedEvent) {
    this.broadcastMessage('post_words_updated', postWords);
  }

  @OnEvent('post_created')
  async handlePostCreatedEvent(payload: PostCreatedEvent) {
    this.broadcastMessage('post_created', { post: payload.post });
  }
}
