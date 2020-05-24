import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';

export default class Country extends Component {
  url = 'http://country.io/names.json';
  isStart = true;

  state = {
    json: null,
    json2: null,
    country: 'Russia',
  };

  async getCountry() {
    try {
      var response = await fetch(this.url);
      var json = await response.json();
      this.setState({json: json});
    } catch (error) {
      alert('Failed with ' + error.message);
    }
  }

  changeJson() {
    var json2 = {};
    if (this.state.json !== null) {
      var keys = Object.keys(this.state.json);
      keys.forEach(key => {
        var val = this.state.json[key];
        json2[val] = key;
      });
    }
    this.setState({
      json2: json2,
    });
  }

  componentDidMount() {
    this.getCountry();
  }

  componentDidUpdate() {
    if (this.isStart) {
      this.changeJson();
      this.isStart = false;
    }
  }

  updateCountry = country => {
    this.setState({
      country: country,
    });
    this.props.navigation.navigate('Chart', {
      alpha2code: this.state.json2[country],
      country: country,
    });
  };

  render() {
    var list_country = [];
    if (this.state.json2 !== null) {
      var keys = Object.keys(this.state.json2);
      keys.forEach(i => {
        list_country.push(i);
      });
      list_country.sort();
    }

    return (
      <View>
        <FlatList
          data={list_country}
          renderItem={({item, index}) => {
            return (
              <FlatListItem
                item={item}
                index={index}
                updateCountry={this.updateCountry}
              />
            );
          }}
        />
      </View>
    );
  }
}

class FlatListItem extends Component {
  constructor(props) {
    super(props);
  }

  onTouch() {
    this.props.updateCountry(this.props.item);
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.onTouch();
          }}>
          <Text style={styles.text}> {this.props.item} </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 32,
  },
  input: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#777',
    width: 300,
    height: 40,
    margin: 10,
  },
});
