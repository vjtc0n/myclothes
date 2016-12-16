/**
 * Created by vjtc0n on 12/15/16.
 */
import React, { Component } from 'react';
import {
    TextInput,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    Animated,
    Dimensions,
    Platform,
    ListView,
    RefreshControl
} from 'react-native';

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'


import {Actions} from 'react-native-router-flux'
import Timeline from '../../Timeline/timeline'
import Icon from 'react-native-vector-icons/FontAwesome'
import ImageP from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import ButtonAPSL from 'apsl-react-native-button'

import Comment from '../../Comment/commentmodal';
import * as API from '../libs/backend'

var DATA = [];


function mapStateToProps (state) {
    return {
        auth: state.auth,
        personal: state.personal,
        global: state.global
    }
}

class CashManagement extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows(DATA),
            data: []
        };
    }

    componentWillMount() {
        var self = this;
        API.getMyProducts(this.props.global.user.token.userId)
            .then((json) => {
                const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                this.setState({
                    dataSource: ds.cloneWithRows(json)
                }, () => {
                    var totalCash = 0;
                    json.forEach(function (product) {
                        var totalQuantity = 0;
                        if (product.orders.length != 0) {
                            product.orders.forEach(function (order) {
                                if (order.accepted == true) {
                                    totalQuantity += order.quantity;
                                }
                            })
                        }
                        totalCash += totalQuantity*product.price;
                    });
                    API.getUserInfo(self.props.global.user.token.userId)
                        .then((json) => {
                            var currentCash = json.cash;
                            API.updateCash(self.props.global.user.token.userId, {cash: totalCash + currentCash})
                                .then((json) => {

                                })
                        });
                    self.setState({
                        yourCash: totalCash
                    })
                })
            })
    }

    onBackPress() {
        Actions.pop();
    }

    renderHeader() {
        return (
            <View style={{borderBottomLeftRadius: 10, borderBottomRightRadius: 10
                , marginBottom: 20, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
                , borderBottomWidth: 3, borderColor: '#365FB7'
                , backgroundColor: 'white'}}>
                <View style={{flex: 1/2, alignItems: 'center'}}>
                    <Text style={{fontWeight: 'bold', color: '#365FB7'}}>Your Cash</Text>
                </View>
                <View style={{flex: 1/2, alignItems: 'center'}}>
                    <Text style={{fontWeight: 'bold', color: '#365FB7', fontSize: 20}}>$ {this.state.yourCash}</Text>
                </View>
            </View>
        )
    }

    renderRow(property) {
        var totalQuantity = 0;
        var numberOfOrders = 0;
        //console.log(property)
        if (property.orders.length != 0) {
            property.orders.forEach(function (order) {
                if (order.accepted == true) {
                    totalQuantity += order.quantity;
                    numberOfOrders ++;
                }
            })
        }

        return (
            <View style={{flexDirection: 'row', height: 120
                , borderTopWidth: 3, borderColor: '#f66f88'
                , borderRadius: 10, backgroundColor: 'white'}}>
                <View style={{flex: 1/2, flexDirection: 'row', margin: 10}}>
                    <ImageP
                        style={{borderWidth: 0.5, borderColor: 'gray', borderRadius: 10, flex: 1/2}}
                        source={{uri: property.imgList[0]}}
                        indicator={Progress.CircleSnail}/>
                    <View style={{flexDirection: 'column', flex: 1/2, justifyContent: 'space-between', marginLeft: 10}}>
                        <View style={{flexDirection: 'column'}}>
                            <Text style={styles.productNameText}>{property.name}</Text>

                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.totalText}>$</Text>
                            <Text style={styles.totalText}>{property.price}</Text>
                        </View>
                    </View>
                </View>
                <View style={{flex: 1/2, margin: 10
                    , borderWidth: 0, justifyContent: 'space-between'
                    , flexDirection: 'row'}}>
                    <View style={{flex: 1/2, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Text>Quantity</Text>
                        <Text style={{fontWeight: 'bold', color: 'gray', fontSize: 20,}}>{totalQuantity}</Text>
                        <Text style={{color: 'white'}}>ABC</Text>
                    </View>
                    <View style={{flex: 1/2, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Text>Orders</Text>
                        <Text style={{fontWeight: 'bold', color: 'gray', fontSize: 20,}}>{numberOfOrders}</Text>
                        <Text style={{color: 'white'}}>ABC</Text>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={styles.navBar}>
                    <Icon
                        onPress={() => this.onBackPress()}
                        name="angle-left"
                        size={40}
                        style={{color: 'white', marginLeft: 20}}/>
                    <Text style={{fontSize: 20, color: 'white'}}>Cash Management</Text>
                    <View style={{marginRight: 30}} />
                </View>
                <ListView
                    //scrollEnabled={false}
                    renderHeader={() => this.renderHeader()}
                    style={{ borderRightWidth: 2, backgroundColor: '#cccccc'}}
                    removeClippedSubviews={false}
                    renderSeparator={(sectionId, rowId) => <View key={rowId} style={{ height: 7, backgroundColor: '#cccccc'}} />}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    enableEmptySections={true}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    navBar: {
        height: 50,
        backgroundColor: '#f66f88',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    resultText: {
        fontWeight: 'bold',
        color: 'gray'
    },
    totalText: {
        fontWeight: 'bold',
        color: '#365FB7'
    },
    productNameText: {
        fontWeight: 'bold',
        color: '#f66f88'
    }
});

export default connect(mapStateToProps)(CashManagement)
