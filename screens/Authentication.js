import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import realtimeDatabase from '../data/RealtimeDatabase';
import theme from '../theme';
import { set } from 'firebase/database';

export default function Authentication({ onSuccess }) {
    const [isNewUser, setIsNewUser] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const handleLogin = async () => {
        if (!validateEmail(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Invalid Password', 'Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);
        const result = await realtimeDatabase.login(email, password);
        if (result.success) {
            //Alert.alert('Login Successful', 'You have logged in successfully.');
            onSuccess();
        } else {
            Alert.alert('Login Failed', result.message);
        }
        setLoading(false);
    };

    const handleRegister = async () => {
        if (!validateEmail(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Invalid Password', 'Password must be at least 6 characters long.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Passwords Do Not Match', 'Please make sure the passwords match.');
            return;
        }

        setLoading(true);
        const result = await realtimeDatabase.register(email, password);
        if (result.success) {
            Alert.alert('Registration Successful', 'You have registered successfully.');
            onSuccess();
        } else {
            Alert.alert('Registration Failed', result.message);
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isNewUser ? 'Register' : 'Login to continue'}</Text>
            <View style={styles.underline} />
            <Image source={require('../assets/login-image.png')} style={styles.image} />
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />
            {isNewUser && (
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
            )}
            <TouchableOpacity
                style={styles.button} disabled={loading}
                onPress={isNewUser ? handleRegister : handleLogin}>
                <Text style={styles.buttonText}>{isNewUser ? 'Create Account' : 'Login'}</Text>
            </TouchableOpacity>
            <Text style={styles.registerText}>
                {isNewUser ? 'Already a User?' : "Don't have an Account?"}
            </Text>
            <TouchableOpacity onPress={() => setIsNewUser(!isNewUser)} disabled={loading}>
                <Text style={styles.registerLink}>{isNewUser ? 'Login Here' : 'Register Here'}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 27,
        fontWeight: 'bold',
        color: theme.colors.blue,
        marginBottom: 10,
    },
    underline: {
        width: 50,
        height: 3,
        backgroundColor: theme.colors.yellow,
        marginBottom: 30,
    },
    image: {
        width: 150,
        height: 150,
        marginBottom: 30,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: theme.colors.lightGray,
        borderRadius: 25,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: theme.colors.red,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    registerText: {
        fontSize: 16,
        color: '#757575',
        marginTop: 25,
        marginBottom: 10,
    },
    registerLink: {
        fontSize: 18,
        color: theme.colors.red,
        fontWeight: 'bold',
    },
});
