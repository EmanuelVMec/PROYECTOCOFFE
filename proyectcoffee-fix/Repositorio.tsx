import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  FlatList, TouchableOpacity, Alert
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import Footer from './Footer';

const Repositorio = () => {
  const [archivos, setArchivos] = useState<string[]>([]);

  useEffect(() => {
    const cargarArchivos = async () => {
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'No se puede acceder a los archivos.');
          return;
        }

        const albums = await MediaLibrary.getAlbumsAsync();
        const repositorio = albums.find(a => a.title === 'Repositorio_Coffee');
        if (!repositorio) return;

        const media = await MediaLibrary.getAssetsAsync({
          album: repositorio,
          mediaType: 'photo', // También detecta PDF como documentos (algunos casos los pone aquí)
          first: 100,
          sortBy: MediaLibrary.SortBy.creationTime,
        });

        const archivosPdf = media.assets
          .filter(asset => asset.filename.toLowerCase().endsWith('.pdf'))
          .map(asset => asset.filename);

        setArchivos(archivosPdf);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'No se pudieron cargar los archivos.');
      }
    };

    cargarArchivos();
  }, []);

  const mostrarContenido = async (nombreArchivo: string) => {
    try {
      const folderUri = FileSystem.cacheDirectory; // Cambia si lo guardaste en otro sitio
      const ruta = folderUri + nombreArchivo;
      const contenido = await FileSystem.readAsStringAsync(ruta);
      Alert.alert('Contenido del archivo', contenido);
    } catch (error) {
      Alert.alert('Error', 'No se pudo leer el contenido.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Repositorio de Predicciones</Text>
        {archivos.length === 0 ? (
          <Text style={styles.subtitle}>No hay archivos PDF guardados aún.</Text>
        ) : (
          <FlatList
            data={archivos}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => mostrarContenido(item)}
              >
                <Text style={styles.itemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
});

export default Repositorio;
