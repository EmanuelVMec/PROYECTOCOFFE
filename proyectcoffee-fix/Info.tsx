import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from 'react-native-vector-icons';
import Footer from './Footer'; // Asegúrate de que la ruta sea correcta

const Info = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 100 }]}>
        <View style={styles.header}>
          <FontAwesome5 name="coffee" size={28} color="#8B4513" />
          <Text style={styles.title}>COFFEE - FORECAST</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.text}>
            El proyecto <Text style={styles.bold}>Desarrollo de una aplicación móvil de predicción automática de producción de café con Inteligencia Artificial </Text> 
            se centra en la creación de una app predictiva para optimizar la producción de café en el sector de Sacha Wiwa en el canton La Maná.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.subHeader}>
            <MaterialIcons name="info-outline" size={24} color="#2196F3" />
            <Text style={styles.subTitle}>Guía de la Aplicación</Text>
          </View>
          <View style={styles.guideContainer}>
            <Text style={styles.guideText}>
              📌 Los datos ingresados deben ser <Text style={styles.bold}>positivos</Text> y solo se permite el uso del punto decimal.
            </Text>
            <Text style={styles.guideText}>
              📌 La aplicación tiene 4 opciones principales:
            </Text>
            <View style={styles.listItem}>
              <Ionicons name="home" size={20} color="#FF9800" />
              <Text style={styles.listText}>HOME (Pantalla de inicio)</Text>
            </View>
            <View style={styles.listItem}>
              <Ionicons name="analytics" size={20} color="#4CAF50" />
              <Text style={styles.listText}>PREDECIR (Modelo predictivo)</Text>
            </View>
            <View style={styles.listItem}>
              <Ionicons name="folder" size={20} color="#673AB7" />
              <Text style={styles.listText}>REPOSITORIO (Archivos guardados en directorio local)</Text>
            </View>
            <View style={styles.listItem}>
              <Ionicons name="information-circle" size={20} color="#03A9F4" />
              <Text style={styles.listText}>INFO (Información de la aplicación)</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
  <View style={styles.subHeader}>
    <FontAwesome5 name="laptop-code" size={22} color="#FF5722" />
    <Text style={styles.subTitle}>Desarrollo de la Aplicación</Text>
  </View>

  <Text style={styles.text}>
  🌿 Este proyecto está vinculado con <Text style={[styles.bold, { color: 'green' }]}>FIASA</Text>, una organización ecuatoriana comprometida con la innovación agrícola.
</Text>
<Text style={styles.text}>
  🧑‍🌾 <Text style={[styles.bold, { color: 'green' }]}>FIASA</Text> (Fertilizantes Industriales Agrícolas S.A.) trabaja en soluciones integrales para el desarrollo agrícola sostenible en Ecuador, brindando apoyo técnico y productos para mejorar la productividad de los cultivos.
</Text>
<Text style={styles.text}>
  🚀 La aplicación fue desarrollada con <Text style={styles.bold}>React Native</Text>, un framework de código abierto creado por Meta.
</Text>
<Text style={styles.text}>
  🖥️ Su estructura está basada en <Text style={styles.bold}>Django</Text>, permitiendo la integración de la inteligencia artificial predictiva.
</Text>
<Text style={styles.text}>
  🤖 La IA utiliza un modelo de aprendizaje basado en <Text style={styles.bold}>árboles de decisión</Text> almacenado en un archivo .pkl.
</Text>
<Text style={styles.text}>
  👨‍💻 Desarrolladores:{'\n'}
  <Text style={styles.bold}>• Joshua Emanuel Vinces Manrique{'\n'}• Bryan Alexander Alvarez Real</Text>
</Text>
</View>

      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#c1a480',
  },
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#8B4513',
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  text: {
    fontSize: 16,
    textAlign: 'justify',
    marginBottom: 10,
    color: '#555',
  },
  bold: {
    fontWeight: 'bold',
  },
  guideContainer: {
    backgroundColor: '#FFF3E0',
    padding: 15,
    borderRadius: 10,
  },
  guideText: {
    fontSize: 16,
    paddingVertical: 5,
    color: '#333',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  listText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#555',
  },
});

export default Info;
