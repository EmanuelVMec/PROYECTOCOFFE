import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import { StorageAccessFramework } from 'expo-file-system';
import Footer from './Footer';

const Repositorio = () => {
  const [files, setFiles] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);

  const pickFolder = async () => {
    try {
      const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) return Alert.alert('Permiso denegado');

      const uri = permissions.directoryUri;

      const fileList = await StorageAccessFramework.readDirectoryAsync(uri);
      const filtered = await Promise.all(
  fileList
    .filter((f) => f.includes('Prediccion') && f.endsWith('.xlsx'))
    .map(async (f) => {
      const info = await FileSystem.getInfoAsync(f);
      const formattedDate = info.modificationTime
        ? new Date(info.modificationTime * 1000).toLocaleString()
        : 'Sin fecha';
      return {
        uri: f,
        name: decodeURIComponent(f.split('/').pop()),
        date: formattedDate,
      };
    })
);


      setFiles(filtered);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo abrir la carpeta');
    }
  };

  const handleOpenFile = async (file) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const binary = atob(base64);
      const workbook = XLSX.read(binary, { type: 'binary' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      setSelectedContent(data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo leer el archivo Excel');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Repositorio de Predicciones</Text>

      <TouchableOpacity style={styles.pickButton} onPress={pickFolder}>
        <Text style={styles.pickButtonText}>Seleccionar carpeta</Text>
      </TouchableOpacity>

      <FlatList
        data={files}
        keyExtractor={(item, index) => `${item.uri}_${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handleOpenFile(item)}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemDate}>{item.date}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No hay archivos disponibles.</Text>}
      />

      {selectedContent && (
        <ScrollView style={styles.preview}>
          <Text style={styles.previewTitle}>Vista previa del archivo:</Text>
          <View style={styles.table}>
            {selectedContent.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.tableRow}>
                {row.map((cell, cellIndex) => (
                  <View key={cellIndex} style={styles.tableCell}>
                    <Text style={styles.cellText}>{String(cell)}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 0, paddingBottom: 90 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 70, color: '#5e3c1d', top: 50 },
  pickButton: { backgroundColor: '#5e3c1d', padding: 10, borderRadius: 10, marginBottom: 10 },
  pickButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  item: { backgroundColor: '#feecd1', padding: 12, borderRadius: 8, marginVertical: 5 },
  itemText: { color: '#5e3c1d', fontWeight: '500' },
  itemDate: { color: '#888', fontSize: 12 },
  empty: { marginTop: 30, textAlign: 'center', color: '#999' },
  preview: { marginTop: 20, backgroundColor: '#fff', padding: 10, borderRadius: 10 },
  previewTitle: { fontWeight: 'bold', marginBottom: 5, color: '#333' },
  table: { borderWidth: 1, borderColor: '#ccc' },
  tableRow: { flexDirection: 'row' },
  tableCell: { flex: 1, padding: 5, borderWidth: 0.5, borderColor: '#ccc' },
  cellText: { fontSize: 12, color: '#444' },
});

export default Repositorio;
