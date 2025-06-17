import React, { useState } from 'react';
import {
  View, TextInput, Button, StyleSheet,
  Alert, Text, ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import Footer from './Footer';

const API_URL = 'http://192.168.0.101:8000/api/prediccion/';

const SecondScreen = () => {
  const initialInputs = {
    EDAD_EN_DIAS: '', TEMPERATURA_AMBIENTAL: '', HUMEDAD_AMBIENTAL: '',
    HUMEDAD_SUELO: '', PRESION_ATMOSFERICA: '', TEMPERATURA_SUELO: '',
    INDICE_DE_LLUVIA: '', PH: '', CE: '', MO: '', NH4: '', P: '', S: '',
    K: '', Ca: '', Mg: '', Cu: '', B: '', Fe: '', Zn: '', Mn: '',
    N_total: '', ARENA: '', LIMO: '', ARCILLA: ''
  };

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
      result.error
        ? Alert.alert('Error', result.error)
        : setPrediction(result.prediction);

    } catch {
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
        const predictionText = Object.entries(prediction)
          .map(([k, v]) => `${k}: ${parseFloat(v).toFixed(2)}`).join('\n');

        const fileUri = FileSystem.documentDirectory + 'prediccion_resultados.txt';
        await FileSystem.writeAsStringAsync(fileUri, predictionText);
        Alert.alert('Guardado', `Archivo guardado en: ${fileUri}`);
      } else {
        Alert.alert('Error', 'No hay predicciones para guardar.');
      }
    } catch {
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

        {/* Campos individuales */}
        <View style={styles.grid}>
          {Object.keys(inputs).slice(0, 7).map((key, index) => (
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

        {/* Campos dobles */}
        <View style={styles.doubleColumnGrid}>
          {Object.keys(inputs).slice(7).map((key, index) => (
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
                {`${key}: ${parseFloat(value).toFixed(2)}`}
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
