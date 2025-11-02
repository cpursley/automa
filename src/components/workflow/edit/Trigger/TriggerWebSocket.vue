<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-1">WebSocket URL</label>
      <input
        v-model="localData.url"
        type="text"
        placeholder="ws://localhost:4000 or wss://example.com"
        class="w-full px-3 py-2 border rounded-md"
        @change="updateData"
      />
      <p class="text-xs text-gray-500 mt-1">
        Enter the WebSocket server URL (automatically converts http/https to ws/wss)
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Channel Name</label>
      <input
        v-model="localData.channel"
        type="text"
        placeholder="room:lobby"
        class="w-full px-3 py-2 border rounded-md"
        @change="updateData"
      />
      <p class="text-xs text-gray-500 mt-1">
        Phoenix channel name (e.g., "room:lobby" or "notifications")
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Topic (Optional)</label>
      <input
        v-model="localData.topic"
        type="text"
        placeholder="defaults to channel name if empty"
        class="w-full px-3 py-2 border rounded-md"
        @change="updateData"
      />
      <p class="text-xs text-gray-500 mt-1">
        Phoenix topic (defaults to channel name if not specified)
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Event Filter (Optional)</label>
      <input
        v-model="localData.eventFilter"
        type="text"
        placeholder="e.g., message:new"
        class="w-full px-3 py-2 border rounded-md"
        @change="updateData"
      />
      <p class="text-xs text-gray-500 mt-1">
        Filter by event name (leave empty to listen to all events)
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Join Parameters (JSON)</label>
      <textarea
        v-model="paramsJson"
        placeholder='{"user_id": 123, "token": "abc123"}'
        class="w-full px-3 py-2 border rounded-md font-mono text-sm"
        rows="3"
        @change="updateParams"
      />
      <p class="text-xs text-gray-500 mt-1">
        Parameters to send when joining the channel
      </p>
    </div>

    <div class="border-t pt-4">
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          v-model="localData.reconnect"
          type="checkbox"
          class="w-4 h-4"
          @change="updateData"
        />
        <span class="text-sm font-medium">Auto-reconnect on disconnect</span>
      </label>
    </div>

    <div v-if="localData.reconnect">
      <label class="block text-sm font-medium mb-1">
        Reconnect Interval (milliseconds)
      </label>
      <input
        v-model.number="localData.reconnectInterval"
        type="number"
        min="1000"
        step="1000"
        class="w-full px-3 py-2 border rounded-md"
        @change="updateData"
      />
      <p class="text-xs text-gray-500 mt-1">
        Time to wait before attempting to reconnect (minimum 1000ms)
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update']);

const localData = ref({ ...props.data });
const paramsJson = ref(JSON.stringify(props.data.params || {}));

function updateData() {
  emit('update', { ...localData.value });
}

function updateParams() {
  try {
    localData.value.params = JSON.parse(paramsJson.value);
    updateData();
  } catch (error) {
    console.error('Invalid JSON in parameters:', error);
  }
}

watch(
  () => props.data,
  (newData) => {
    localData.value = { ...newData };
    paramsJson.value = JSON.stringify(newData.params || {});
  }
);
</script>

<style scoped>
input,
textarea {
  @apply bg-white text-gray-900 placeholder-gray-400;
}

input:focus,
textarea:focus {
  @apply ring-2 ring-blue-500 border-transparent;
}
</style>