import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, Alert, Text, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import Footer from './Footer';

const API_URL = 'http://10.10.49.65:8000/api/prediccion/';

const SecondScreen = () => {
  const initialInputs = {
  EDAD_EN_DIAS: '',
  TEMPERATURA_AMBIENTAL: '',
  HUMEDAD_AMBIENTAL: '',
  HUMEDAD_SUELO: '',
  PRESION_ATMOSFERICA: '',
  TEMPERATURA_SUELO: '',
  INDICE_DE_LLUVIA: '',
  PH: '',
  CE: '',
  MO: '',
  NH4: '',
  P: '',
  S: '',
  K: '',
  Ca: '',
  Mg: '',
  Cu: '',
  B: '',
  Fe: '',
  Zn: '',
  Mn: '',
  N_total: '',
  ARENA: '',
  LIMO: '',
  ARCILLA: ''
};

  const [inputs, setInputs] = useState(initialInputs);
  const [selectedOption, setSelectedOption] = useState('0');
  const [prediction, setPrediction] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  const handleInputChange = (name, value) => {
    // Permitir solo números positivos y decimales
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      const updatedInputs = { ...inputs, [name]: value };
      setInputs(updatedInputs);
      setIsComplete(Object.values(updatedInputs).every(val => val.trim() !== ''));
    }
  };

  const handlePickerChange = (value) => {
    setSelectedOption(value);
  };

  const handleSubmit = async () => {
    if (!isComplete) {
      Alert.alert('Error', 'Por favor complete todos los campos antes de procesar.');
      return;
    }
    try {
      const requestData = {
        'TIPO_DE_CAFE': selectedOption,
        ...Object.fromEntries(Object.entries(inputs).map(([key, value]) => [key, parseFloat(value) || 0])),
      };

      console.log('Datos enviados:', requestData);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (result.error) {
        Alert.alert('Error', result.error);
      } else {
        setPrediction(result.prediction);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    }
  };

  const handleRefresh = () => {
    setInputs(initialInputs);
    setSelectedOption('0');
    setPrediction(null);
    setIsComplete(false);
  };

  const handleSave = async () => {
    try {
      if (prediction) {
        // Convertir los resultados de la predicción en texto
        const predictionText = Object.entries(prediction)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');

        // Crear un archivo .txt en el directorio de documentos de la app
        const fileUri = FileSystem.documentDirectory + 'prediccion_resultados.txt';
        await FileSystem.writeAsStringAsync(fileUri, predictionText);

        Alert.alert('Guardado', `Archivo guardado en: ${fileUri}`);
      } else {
        Alert.alert('Error', 'No hay predicciones para guardar.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el archivo.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={require('./assets/logoapp.png')} style={styles.logo} />

        <View style={styles.pickerContainer}>
  <Picker
  selectedValue={selectedOption}
  style={styles.picker}
  onValueChange={handlePickerChange}
>
  <Picker.Item label="Manabi01" value="0" color="#003366" />
  <Picker.Item label="Sarchimor" value="1" color="#003366" />
</Picker>
</View>


     {/* Campos antes de PH (índice 0 al 6) */}
<View style={styles.grid}>
  {Object.keys(inputs)
    .slice(0, 7)
    .map((key, index) => (
      <View key={index} style={styles.inputGroupSingle}>
        <Text style={styles.label}>{key}</Text>
        <TextInput
          style={styles.input}
          value={inputs[key]}
          keyboardType="numeric"
          onChangeText={(text) => handleInputChange(key, text)}
        />
      </View>
    ))}
</View>

{/* Campos desde PH hasta ARCILLA (doble columna) */}
<View style={styles.doubleColumnGrid}>
  {Object.keys(inputs)
    .slice(7)
    .map((key, index) => (
      <View key={index} style={styles.inputGroup}>
        <Text style={styles.label}>{key}</Text>
        <TextInput
          style={styles.input}
          value={inputs[key]}
          keyboardType="numeric"
          onChangeText={(text) => handleInputChange(key, text)}
        />
      </View>
    ))}
</View>




        <Button title="Procesar" onPress={handleSubmit} disabled={!isComplete} />
        <Button title="Refrescar" onPress={handleRefresh} color="red" />

        {prediction && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Resultados de la Predicción:</Text>
            {Object.entries(prediction).map(([key, value]) => (
              <Text key={key} style={styles.resultText}>{`${key}: ${value}`}</Text>
            ))}
            <Button title="Guardar" onPress={handleSave} color="green" />
          </View>
        )}
      </View>
      <Footer />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  container: { flex: 1, backgroundColor: '#c1a480', alignItems: 'center', paddingBottom: 90 },
  inputGroupSingle: {
  width: '220%', // campo completo en una sola columna
  marginVertical: 5,
},

inputGroup: {
  width: '50%', // dos columnas
  marginVertical: 5,
},

label: {
  marginBottom: 4,
  fontSize: 14,
  color: '#333',
  fontWeight: 'bold',
},

grid1: {
  width: '80%',
  marginBottom: 20,
},

doubleColumnGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  width: '80%',
  marginBottom: 20,
},

  logo: { width: 100, height: 100, marginBottom: 20 },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 20, backgroundColor: '#f1f0e9', width: '80%' },
  picker: { height: 50, width: '100%' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20, width: '80%' },
input: {
  width: '45%',
  padding: 10,
  borderWidth: 1,
  borderColor: '#ccc',
  marginVertical: 10,
  borderRadius: 5,
  backgroundColor: '#f1f0e9',
  color: '#003366' // Azul oscuro
},
  resultContainer: { marginTop: 20, padding: 10, backgroundColor: '#FFF', borderRadius: 5, width: '80%', alignItems: 'center', borderWidth: 1, borderColor: '#ccc' },
  resultTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  resultText: { fontSize: 14 },
});

export default SecondScreen;
