import React, { useState } from 'react';
import {
  View, TextInput, Button, StyleSheet,
  Alert, Text, ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import { StorageAccessFramework } from 'expo-file-system';
import Footer from './Footer';
import * as XLSX from 'xlsx';
import { usePredictionStore } from './usePredictionStore';

const API_URL = 'https://django-railway-coffeeforecast.up.railway.app/api/prediccion/';

const labelMap = {
  EDAD_EN_DIAS: 'EDAD_EN_DIAS',
  TEMPERATURA_AMBIENTAL: 'TEMPERATURA_AMBIENTAL (°C)',
  HUMEDAD_AMBIENTAL: 'HUMEDAD_AMBIENTAL (%)',
  HUMEDAD_SUELO: 'HUMEDAD_SUELO (%)',
  PRESION_ATMOSFERICA: 'PRESIÓN_ATMOSFÉRICA (hPa)',
  TEMPERATURA_SUELO: 'TEMPERATURA_SUELO (°C)',
  INDICE_DE_LLUVIA: 'ÍNDICE_DE_LLUVIA (mm)',
  PH: 'PH',
  CE: 'CE (dS/m)',
  MO: 'MO (%)',
  NH4: 'NH₄ (mg/kg)',
  P: 'P (mg/kg)',
  S: 'S (mg/kg)',
  K: 'K (mg/kg)',
  Ca: 'Ca (cmol/kg)',
  Mg: 'Mg (cmol/kg)',
  Cu: 'Cu (mg/kg)',
  B: 'B (mg/kg)',
  Fe: 'Fe (mg/kg)',
  Zn: 'Zn (mg/kg)',
  Mn: 'Mn (mg/kg)',
  N_total: 'N_total (%)',
  ARENA: 'ARENA (%)',
  LIMO: 'LIMO (%)',
  ARCILLA: 'ARCILLA (%)'
};

const SecondScreen = () => {
  const initialInputs = Object.keys(labelMap).reduce((acc, key) => ({ ...acc, [key]: '' }), {});
  const [inputs, setInputs] = useState(initialInputs);
  const [selectedOption, setSelectedOption] = useState('0');
  const [prediction, setPrediction] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  const handleInputChange = (name, value) => {
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      const updatedInputs = { ...inputs, [name]: value };
      setInputs(updatedInputs);
      setIsComplete(Object.values(updatedInputs).every(val => val.trim() !== ''));
    }
  };

  const handlePickerChange = (value) => setSelectedOption(value);

const handleSubmit = async () => {
  if (!isComplete) {
    Alert.alert('Error', 'Por favor complete todos los campos antes de procesar.');
    return;
  }

  const values = Object.values(inputs).map(v => parseFloat(v));
  const allZeros = values.every(v => v === 0);
  const allEqual = values.every(v => v === values[0]);

  const edad = parseFloat(inputs.EDAD_EN_DIAS);
  if (isNaN(edad) || edad < 30) {
    Alert.alert('Error', 'La edad en días debe ser mayor o igual a 30 para procesar la predicción.');
    return;
  }

  const frequencyMap = {};
  values.forEach(v => {
    frequencyMap[v] = (frequencyMap[v] || 0) + 1;
  });
  const maxCount = Math.max(...Object.values(frequencyMap));
  const percentageEqual = maxCount / values.length;

  if (allZeros || allEqual || percentageEqual >= 0.9) {
    Alert.alert('Error', 'Los datos ingresados no son lo suficientemente variados para realizar la predicción.');
    return;
  }

  try {
    const requestData = {
      'TIPO_DE_CAFE': selectedOption,
      ...Object.fromEntries(Object.entries(inputs).map(([k, v]) => [k, parseFloat(v) || 0]))
    };

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
      const store = usePredictionStore.getState();
      store.setPrediction(result.prediction);
      store.setInputs(inputs);
      store.setTipoCafe(Number(selectedOption)); // 🔧 Aseguramos que se guarda como número
    }
  } catch (error) {
    Alert.alert('Error', 'No se pudo conectar con el servidor.');
    console.error(error);
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
    const predictionState = usePredictionStore.getState();
    const prediction = predictionState.prediction;
    const inputData = predictionState.inputs;
    const tipoCafe = predictionState.tipoCafe ?? 0; // 🔧 Valor por defecto numérico

    if (!prediction) {
      Alert.alert('Error', 'No hay predicciones para guardar.');
      return;
    }

    const nombreCafe = tipoCafe === 0 ? 'Manabi01' : 'Sarchimor'; // 🔧 Comparación correcta

    const data = [
      ['Tipo de Café', nombreCafe],
      ['', ''],
      ['Dato', 'Valor'],
      ...Object.entries(inputData),
      ['', ''],
      ['Resultado de la predicción', ''],
      ...Object.entries(prediction).map(([k, v]) => [
        k,
        `${parseFloat(v).toFixed(2)}${
          k.toLowerCase().includes('altura') || k.toLowerCase().includes('diametro') ? ' cm' : ''
        }`
      ]),
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Prediccion');

    const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
    const filename = `Prediccion_${Date.now()}.xlsx`;

    const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) {
      Alert.alert('Permiso requerido', 'Debes permitir acceso para guardar el archivo.');
      return;
    }

    const fileUri = await StorageAccessFramework.createFileAsync(
      permissions.directoryUri,
      filename,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    await FileSystem.writeAsStringAsync(fileUri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });

    Alert.alert('Éxito', 'Archivo Excel guardado correctamente.');
  } catch (err) {
    console.error(err);
    Alert.alert('Error', 'No se pudo guardar el archivo.');
  }
};

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>PROCESAMIENTO DE DATOS</Text>

        <View style={styles.pickerWrapper}>
          <Text style={styles.label}>Selecciona el tipo de café</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedOption}
              style={styles.picker}
              onValueChange={handlePickerChange}
            >
              <Picker.Item label="Manabi01" value="0" color="#5e3c1d" />
              <Picker.Item label="Sarchimor" value="1" color="#5e3c1d" />
            </Picker>
          </View>
        </View>

        <View style={styles.grid}>
          {Object.keys(inputs).slice(0, 7).map((key, index) => (
            <View key={index} style={styles.inputGroupSingle}>
              <Text style={styles.label}>{labelMap[key] || key}</Text>
              <TextInput
                style={styles.input}
                value={inputs[key]}
                keyboardType="numeric"
                onChangeText={(text) => handleInputChange(key, text)}
              />
            </View>
          ))}
        </View>

        <View style={styles.doubleColumnGrid}>
          {Object.keys(inputs).slice(7).map((key, index) => (
            <View key={index} style={styles.inputGroup}>
              <Text style={styles.label}>{labelMap[key] || key}</Text>
              <TextInput
                style={styles.input}
                value={inputs[key]}
                keyboardType="numeric"
                onChangeText={(text) => handleInputChange(key, text)}
              />
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.softButton}>
            <Button title="Procesar" onPress={handleSubmit} disabled={!isComplete} color="#5e3c1d" />
          </View>
          <View style={styles.softButton}>
            <Button title="Refrescar" onPress={handleRefresh} color="#a83232" />
          </View>
        </View>

        {prediction && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Resultados de la Predicción:</Text>
            {Object.entries(prediction).map(([key, value]) => (
              <Text key={key} style={styles.resultText}>
                {`${key}: ${parseFloat(value).toFixed(2)}${key.toLowerCase().includes('altura') || key.toLowerCase().includes('diametro') ? ' cm' : ''}`}
              </Text>
            ))}

            <View style={styles.softButton}>
              <Button title="Guardar" onPress={handleSave} color="#1f7a3a" />
            </View>
          </View>
        )}
      </View>
      <Footer />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  container: {
    flex: 1,
    backgroundColor: '#e9e4dc',
    alignItems: 'center',
    paddingBottom: 90
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5e3c1d',
    marginTop: 20,
    marginBottom: 20
  },
  pickerWrapper: {
    width: '80%',
    marginBottom: 20
  },
  pickerContainer: {
    backgroundColor: '#feecd1',
    borderRadius: 12,
    shadowColor: '#ffffff',
    shadowOffset: { width: -4, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
    padding: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#5e3c1d'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '80%'
  },
  doubleColumnGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20
  },
  inputGroupSingle: {
    width: '100%',
    marginVertical: 5,
  },
  inputGroup: {
    width: '48%',
    marginVertical: 5,
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
    color: '#5e3c1d',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#feecd1',
    borderRadius: 12,
    padding: 10,
    color: '#5e3c1d',
    shadowColor: '#fff',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 10,
  },
  buttonContainer: {
    width: '80%',
    marginBottom: 20,
    gap: 10
  },
  softButton: {
    marginVertical: 5,
    borderRadius: 12,
    backgroundColor: '#e9e4dc',
    shadowColor: '#ffffff',
    shadowOffset: { width: -3, height: -3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e9e4dc',
    borderRadius: 12,
    shadowColor: '#ffffff',
    shadowOffset: { width: -3, height: -3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
    width: '80%',
    alignItems: 'center'
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#5e3c1d'
  },
  resultText: {
    fontSize: 14,
    color: '#3e2a14'
  }
});

export default SecondScreen;
