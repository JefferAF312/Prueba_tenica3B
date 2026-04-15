import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type EstadoTarea = 'PENDIENTE' | 'COMPLETADA';

type Tarea = {
  id: number;
  titulo: string;
  descripcion: string | null;
  estado: EstadoTarea;
  fechaCreacion: string;
  fechaActualizacion: string;
};

type ApiError = {
  message?: string;
  error?: string;
};

const env = globalThis as unknown as {
  process?: { env?: Record<string, string | undefined> };
};

const API_URL = (env.process?.env?.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api').replace(/\/$/, '');

export default function App() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState<EstadoTarea>('PENDIENTE');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  const contador = useMemo(() => {
    return `${tareas.length} ${tareas.length === 1 ? 'tarea' : 'tareas'}`;
  }, [tareas.length]);

  const mostrarMensaje = useCallback((texto: string, esError = false) => {
    setMensaje(texto);
    setError(esError);
  }, []);

  const request = useCallback(async <T,>(path: string, options: RequestInit = {}): Promise<T | null> => {
    const response = await fetch(`${API_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    if (response.status === 204) {
      return null;
    }

    const data = (await response.json().catch(() => null)) as T | ApiError | null;

    if (!response.ok) {
      const apiError = data as ApiError | null;
      throw new Error(apiError?.message || apiError?.error || `Error ${response.status}`);
    }

    return data as T;
  }, []);

  const cargarTareas = useCallback(async () => {
    setCargando(true);

    try {
      const data = await request<Tarea[]>('/tareas');
      setTareas(data || []);
      setCargando(false);
    } catch (err) {
      setCargando(false);
      mostrarMensaje(err instanceof Error ? err.message : 'No se pudo conectar con la API', true);
    }
  }, [mostrarMensaje, request]);

  useEffect(() => {
    cargarTareas();
  }, [cargarTareas]);

  async function crearTarea() {
    if (!titulo.trim()) {
      mostrarMensaje('El titulo es obligatorio', true);
      return;
    }

    setCargando(true);

    try {
      await request<Tarea>('/tareas', {
        method: 'POST',
        body: JSON.stringify({
          titulo: titulo.trim(),
          descripcion: descripcion.trim() || null,
          estado,
        }),
      });

      setTitulo('');
      setDescripcion('');
      setEstado('PENDIENTE');
      mostrarMensaje('Tarea creada');
      await cargarTareas();
    } catch (err) {
      setCargando(false);
      mostrarMensaje(err instanceof Error ? err.message : 'No se pudo crear la tarea', true);
    }
  }

  async function cambiarEstado(tarea: Tarea) {
    const nuevoEstado: EstadoTarea = tarea.estado === 'PENDIENTE' ? 'COMPLETADA' : 'PENDIENTE';
    setCargando(true);

    try {
      await request<Tarea>(`/tareas/${tarea.id}`, {
        method: 'PUT',
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      mostrarMensaje('Estado actualizado');
      await cargarTareas();
    } catch (err) {
      setCargando(false);
      mostrarMensaje(err instanceof Error ? err.message : 'No se pudo actualizar', true);
    }
  }

  async function eliminarTarea(tarea: Tarea) {
    setCargando(true);

    try {
      await request<void>(`/tareas/${tarea.id}`, { method: 'DELETE' });
      mostrarMensaje('Tarea eliminada');
      await cargarTareas();
    } catch (err) {
      setCargando(false);
      mostrarMensaje(err instanceof Error ? err.message : 'No se pudo eliminar', true);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>React Native + Spring</Text>
            <Text style={styles.title}>Gestion de tareas</Text>
          </View>
          <Pressable style={styles.iconButton} onPress={cargarTareas}>
            <Text style={styles.iconText}>R</Text>
          </Pressable>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Nueva tarea</Text>
          <Text style={styles.label}>Titulo</Text>
          <TextInput
            style={styles.input}
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Preparar prueba"
            maxLength={120}
          />

          <Text style={styles.label}>Descripcion</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Detalle opcional"
            multiline
            maxLength={500}
          />

          <Text style={styles.label}>Estado</Text>
          <View style={styles.segmented}>
            {(['PENDIENTE', 'COMPLETADA'] as EstadoTarea[]).map((option) => (
              <Pressable
                key={option}
                style={[styles.segmentButton, estado === option && styles.segmentActive]}
                onPress={() => setEstado(option)}
              >
                <Text style={[styles.segmentText, estado === option && styles.segmentTextActive]}>
                  {option === 'PENDIENTE' ? 'Pendiente' : 'Completada'}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.primaryButton} onPress={crearTarea} disabled={cargando}>
            <Text style={styles.primaryButtonText}>Crear</Text>
          </Pressable>
        </View>

        <View style={styles.listHeader}>
          <View>
            <Text style={styles.counter}>{contador}</Text>
            <Text style={styles.sectionTitle}>Tareas</Text>
          </View>
          {cargando ? <ActivityIndicator color="#0f766e" /> : <Text style={styles.status}>API lista</Text>}
        </View>

        <Text style={[styles.message, error && styles.messageError]}>{mensaje}</Text>

        <FlatList
          data={tareas}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={!cargando ? <Text style={styles.empty}>Sin tareas registradas</Text> : null}
          renderItem={({ item }) => (
            <View style={[styles.card, item.estado === 'COMPLETADA' && styles.cardDone]}>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.titulo}</Text>
                <Text style={styles.cardDescription}>{item.descripcion || 'Sin descripcion'}</Text>
                <Text style={[styles.pill, item.estado === 'COMPLETADA' ? styles.pillDone : styles.pillPending]}>
                  {item.estado === 'COMPLETADA' ? 'Completada' : 'Pendiente'}
                </Text>
              </View>
              <View style={styles.actions}>
                <Pressable style={styles.smallButton} onPress={() => cambiarEstado(item)} disabled={cargando}>
                  <Text style={styles.smallButtonText}>{item.estado === 'PENDIENTE' ? 'OK' : 'R'}</Text>
                </Pressable>
                <Pressable style={[styles.smallButton, styles.deleteButton]} onPress={() => eliminarTarea(item)} disabled={cargando}>
                  <Text style={[styles.smallButtonText, styles.deleteButtonText]}>X</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  container: {
    flex: 1,
    padding: 18,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  eyebrow: {
    color: '#0f766e',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  title: {
    color: '#172033',
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 32,
  },
  form: {
    backgroundColor: '#ffffff',
    borderColor: '#d8e2ef',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 18,
    padding: 16,
  },
  sectionTitle: {
    color: '#172033',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 12,
  },
  label: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  input: {
    borderColor: '#cbd5e1',
    borderRadius: 8,
    borderWidth: 1,
    color: '#1e293b',
    minHeight: 44,
    marginBottom: 14,
    paddingHorizontal: 12,
  },
  textarea: {
    minHeight: 86,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  segmented: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  segmentButton: {
    alignItems: 'center',
    borderColor: '#cbd5e1',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 42,
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: '#0f766e',
    borderColor: '#0f766e',
  },
  segmentText: {
    color: '#334155',
    fontWeight: '800',
  },
  segmentTextActive: {
    color: '#ffffff',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#0f766e',
    borderRadius: 8,
    minHeight: 46,
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '900',
  },
  listHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  counter: {
    color: '#0f766e',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  status: {
    color: '#0f766e',
    fontWeight: '800',
  },
  message: {
    color: '#0f766e',
    fontWeight: '800',
    minHeight: 22,
  },
  messageError: {
    color: '#be123c',
  },
  list: {
    gap: 12,
    paddingBottom: 28,
  },
  empty: {
    backgroundColor: '#ffffff',
    borderColor: '#d8e2ef',
    borderRadius: 8,
    borderWidth: 1,
    color: '#64748b',
    fontWeight: '800',
    padding: 28,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#d8e2ef',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    padding: 14,
  },
  cardDone: {
    borderLeftColor: '#16a34a',
    borderLeftWidth: 5,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: '#172033',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 6,
  },
  cardDescription: {
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 10,
  },
  pill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  pillPending: {
    backgroundColor: '#fff7ed',
    color: '#c2410c',
  },
  pillDone: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  actions: {
    gap: 8,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    borderRadius: 8,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  iconText: {
    color: '#334155',
    fontSize: 18,
    fontWeight: '900',
  },
  smallButton: {
    alignItems: 'center',
    borderColor: '#bbf7d0',
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 42,
  },
  smallButtonText: {
    color: '#15803d',
    fontWeight: '900',
  },
  deleteButton: {
    borderColor: '#fecaca',
  },
  deleteButtonText: {
    color: '#be123c',
  },
});
