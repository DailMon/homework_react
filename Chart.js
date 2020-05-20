import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

function Chart({title}) {
  return (
    <View style={styles.header}>
      <Text style={styles.text}>Chart</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 32,
  },
});

export default Chart;
