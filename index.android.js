/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  Image,
  StyleSheet,
  Text,
  View,
  Navigator,
  TextInput,
  ScrollView,
  TouchableHighlight
} from 'react-native';
import { Avatar, Button, Card, Divider } from 'react-native-material-design';
var Modal       = require('react-native-modalbox');
var pokemonData = require('./pokemon.json');

class App extends React.Component {
  render() {
    return (
      <Navigator
          initialRoute={{name: 'Pokedex', component: Pokedex}}
          configureScene={() => {
            return Navigator.SceneConfigs.FloatFromRight;
          }}
          renderScene={(route, navigator) => {
            // count the number of func calls
            console.log(route, navigator); 

            if (route.component) {
              return React.createElement(route.component, { navigator });
            }
          }}
       />
    );
  }
}

var Pokedex = React.createClass ({
  getInitialState() {
      return {
        pokemon: pokemonData,
        currentPokemon: null,
        showCard: false,
        filter: ''
      };
  },

  showPokemonCard(pokemon){
    this.setState({
      currentPokemon: pokemon,
      showCard: true
    });
    this.openModal();
  },

  openModal() {
    if(this.refs.modal.state.isOpen) { this.refs.modal.close(); }
    else { this.refs.modal.open() }
  },

  filterSearch() {
    var pokemonD = pokemonData.filter((card) => {
      return card.name.toLowerCase().search(this.state.filter.toLowerCase()) !== -1;
    });
    console.log(pokemonD);
    this.setState({
      pokemon: pokemonD
    })
  },

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcome}> POKEDEX </Text>
           <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => { 
              this.setState({filter:text});
              this.filterSearch();
            }}
            value={this.state.filter}
          />
        </View>
        <Divider/>
        <PokemonList
          selectPokemon={this.showPokemonCard} 
          data={this.state.pokemon} 
          navigator={this.props.navigator} />
        <Modal style={[styles.modal, styles.modal3]} position={"center"} ref={"modal"} isDisabled={this.state.isDisabled}>
          <PokemonCard 
          style={styles.pokemonCard}
          data={this.state.currentPokemon} 
          isVisible={this.state.showCard} />
        </Modal>
      </View>);
  }
});

var PokemonList = React.createClass({
  selectPokemon(pokemon) {
    this.props.selectPokemon(pokemon);
  },
  render() {
    var pm = this.props.data.map((pokemon, index) => {
        return (
          <PokemonRow
            selectPokemon={this.selectPokemon}
            key={index} 
            data={pokemon} 
            navigator={this.props.navigator}/>
        );
    });
    return <ScrollView>{pm}</ScrollView>;
  }
});

var PokemonRow = React.createClass({
  getInitialState: function() {
    return{
      name: this.props.data.name,
      id: this.props.data.id,
    }
  },

  handlePressPokemon: function() {
    this.props.selectPokemon(this.props.data);
  },

  render() {
    var imgUrl = `http://pokeapi.co/media/img/${this.props.data.id}.png`
    return(
      <View>
        <TouchableHighlight underlayColor={'#E0E0E0'} onPress={this.handlePressPokemon}>
          <View style={styles.pokemon}>
            <Image style={styles.pokemonIcon} source={{uri: imgUrl}}/>
            <Text style={styles.pokemonTitle}>{this.props.data.name.toUpperCase()}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
});

var PokemonCard = React.createClass({
  render() {
    if(this.props.data != null){
      var imgUrl = `http://pokeapi.co/media/img/${this.props.data.id}.png`;
      return(
        <View>
          <Text>{this.props.data.id}. {this.props.data.name}</Text>
          <Image source={{uri:imgUrl}}/>
          <Text>Type: {this.props.data.type}</Text>
        </View>
      );
    } else {
      return null;
    }
  }
})

var getData = function (endpoint) {
  fetch('http://pokeapi.co/api/v2/' + endpoint)
    .then((response) => response.json())
    .then((responseData) => {
      return responseData
    });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header:{
    backgroundColor: '#d32f2f'
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
    color: '#fff'
  },
  pokemon: {
    flexDirection: 'row',
    padding: 3,
    justifyContent: 'center',
    flexWrap: 'nowrap'
  },
  pokemonIcon: {
    width: 50,
    height: 50,
    marginLeft: 30
  },
  pokemonTitle: {
    color: '#9E9E9E',
    marginLeft: 20,
    fontSize: 25,
    width: 280
  },
  pokemonRow: {
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal3: {
    height: 300,
    width: 300
  },
});

AppRegistry.registerComponent('Pokedex', () => App);
