import { ref, computed, onMounted, watch } from 'vue';

const KEY = 'favorites';
const favsRef = ref([]); // array of IDs

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    favsRef.value = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
  } catch {
    favsRef.value = [];
  }
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(favsRef.value));
}

export function useFavorites() {
  // initialize once per app load
  onMounted(() => { if (!favsRef.value.length) load(); });

  // keep storage synced
  watch(favsRef, save, { deep: true });

  // sync across tabs
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) load();
  });

  const list = computed(() => favsRef.value);

  const isFavorite = (id) => {
    const safeId = String(id);
    return favsRef.value.map(String).includes(safeId);
  };

  const add = (id) => {
    const safeId = String(id);
    if (!isFavorite(safeId)) favsRef.value = [...favsRef.value, safeId];
  };

  const remove = (id) => {
    const safeId = String(id);
    favsRef.value = favsRef.value.filter(x => String(x) !== safeId);
  };

  const toggle = (id) => (isFavorite(id) ? remove(id) : add(id));

  const clear = () => { favsRef.value = []; };

  return { list, isFavorite, add, remove, toggle, clear };
}
