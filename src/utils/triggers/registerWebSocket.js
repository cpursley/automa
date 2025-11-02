import browser from 'webextension-polyfill';

export async function registerWebSocket(triggerId, data) {
  try {
    if (!data.url || !data.channel) return;

    const wsConnections =
      (await browser.storage.local.get('wsConnections'))?.wsConnections || {};

    const connectionId = triggerId.includes(':')
      ? triggerId.split(':')[1]
      : triggerId;

    const payload = {
      id: connectionId,
      url: data.url,
      channel: data.channel,
      topic: data.topic || data.channel,
      eventFilter: data.eventFilter || null,
      params: data.params || {},
      reconnect: data.reconnect ?? true,
      reconnectInterval: data.reconnectInterval || 5000,
    };

    wsConnections[connectionId] = payload;
    await browser.storage.local.set({ wsConnections });

    // Notify background script to initialize connection
    await browser.runtime.sendMessage({
      type: 'websocket:register',
      data: payload,
    });
  } catch (error) {
    console.error('Error registering WebSocket trigger:', error);
  }
}

export default registerWebSocket;