import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    SafeAreaView,
    KeyboardAvoidingView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Platform,
    BackHandler,
    ToastAndroid,
    Keyboard,
    useWindowDimensions,
} from 'react-native';
import {RootStackParamList} from "./App";
import {NativeStackScreenProps} from "@react-navigation/native-stack";

export type Ponto = {
    id: string;
    nome: string;
    endereco: string;
    horario: string;
    recebe_distribui: string;
};

type Props = NativeStackScreenProps<RootStackParamList, 'ListaPontos'> & {
    pontos: Ponto[];
    onAdicionarPonto: (ponto: Ponto) => void;
};

export const pontosIniciais: Ponto[] = [
    {id: '1',nome: 'Ponto do miojo', endereco: 'Av do Miojo', horario: '13h:00', recebe_distribui: 'recebe e distribui'},
    {id: '2',nome: 'Ponto dos queijos', endereco: 'Rua dos queijos', horario: '14:00', recebe_distribui: 'Recebe e distribui'},
    {id: '3', nome: 'Ponto dos coquinhos',endereco: 'Av dos coquinhos', horario: '22:00', recebe_distribui: 'Recebe'},
];

function TelaListaPontos({
    navigation,
    pontos,
    onAdicionarPonto,
}: Props) {
    const { width } = useWindowDimensions();
    const numColunas = width >= 600 ? 2 : 1;

    const [busca, setBusca] = useState('');

    const pontosFiltrados = useMemo(
        () =>
            pontos.filter((item) =>
                item.endereco
                    .toLowerCase()
                    .includes(busca.toLowerCase())
            ),
        [pontos, busca]
    );
    const [nome, setNome] = useState('');
    const [endereco, setEndereco] = useState('');
    const [horario, setHorario] = useState('');
    const [recebeDistribui, setRecebeDistribui] = useState('');
    const [erro, setErro] = useState('');

    const inputHorarioRef = useRef<TextInput>(null);
    const inputRecebeDistribuiRef = useRef<TextInput>(null);

    const tocouVoltarUmaVez = useRef(false);

    useEffect(() => {
        if (Platform.OS !== 'android') return;

        const assinatura = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                if (tocouVoltarUmaVez.current) {
                    return false;
                }

                tocouVoltarUmaVez.current = true;

                ToastAndroid.show(
                    'Toque voltar de novo para sair',
                    ToastAndroid.SHORT
                );

                setTimeout(() => {
                    tocouVoltarUmaVez.current = false;
                }, 2000);

                return true;
            }
        );

        return () => assinatura.remove();
    }, []);

    function validarESalvar() {
        if(nome.trim() === ''){
            setErro('O nome não pode ficar vazio');
            return;
        }
        if (endereco.trim() === '') {
            setErro('O endereço não pode ficar vazio.');
            return;
        }

        if (horario.trim() === '') {
            setErro('O horário não pode ficar vazio.');
            return;
        }

        if (recebeDistribui.trim() === '') {
            setErro(
                'Informe se o ponto recebe, distribui ou recebe e distribui.'
            );
            return;
        }

        const valor = recebeDistribui.trim().toLowerCase();

        if (
            valor !== 'recebe' &&
            valor !== 'distribui' &&
            valor !== 'recebe e distribui'
        ) {
            setErro(
                'Digite: "recebe", "distribui" ou "recebe e distribui".'
            );
            return;
        }

        onAdicionarPonto({
            id: Date.now().toString(),
            nome: nome.trim(),
            endereco: endereco.trim(),
            horario: horario.trim(),
            recebe_distribui: valor,
        });

        setNome('');
        setEndereco('');
        setHorario('');
        setRecebeDistribui('');
        setErro('');
        Keyboard.dismiss();
    }

    return (
        <SafeAreaView
            style={styles.area}
        >
            <KeyboardAvoidingView
                style={styles.area}
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : 'height'
                }
            >
                <View style={styles.cadastro}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome do ponto"
                        value={nome}
                        onChangeText={setNome}
                        returnKeyType="next"
                    />
                    <TextInput
                        placeholder="Endereço do ponto"
                        value={endereco}
                        onChangeText={setEndereco}
                        style={styles.input}
                        returnKeyType="next"
                        onSubmitEditing={() =>
                            inputHorarioRef.current?.focus()
                        }
                    />

                    <TextInput
                        ref={inputHorarioRef}
                        placeholder="Horário de funcionamento"
                        value={horario}
                        onChangeText={setHorario}
                        style={styles.input}
                        returnKeyType="next"
                        onSubmitEditing={() =>
                            inputRecebeDistribuiRef.current?.focus()
                        }
                    />

                    <TextInput
                        ref={inputRecebeDistribuiRef}
                        placeholder="Recebe ou distribui?"
                        value={recebeDistribui}
                        onChangeText={setRecebeDistribui}
                        style={styles.input}
                        returnKeyType="done"
                        onSubmitEditing={validarESalvar}
                    />

                    {erro !== '' && (
                        <Text style={styles.erro}>
                            {erro}
                        </Text>
                    )}

                    <TouchableOpacity
                        style={styles.botaoCadastrar}
                        onPress={validarESalvar}
                    >
                        <Text style={styles.botaoCadastrarTexto}>
                            Cadastrar ponto
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.botaoSecundario}
                        onPress={() => navigation.navigate('CadastroDoacao')}
                    >
                        <Text style={styles.botaoSecundarioTexto}>Registrar doação</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.botaoDoacoes}
                        onPress={() => navigation.navigate('MinhasDoacoes')}
                    >
                        <Text style={styles.botaoDoacoesTexto}>
                            Minhas doações
                        </Text>
                    </TouchableOpacity>
                </View>

                <TextInput
                    placeholder="Buscar ponto pelo endereço..."
                    value={busca}
                    onChangeText={setBusca}
                    style={styles.busca}
                />

                <FlatList
                    key={numColunas}
                    data={pontosFiltrados}
                    numColumns={numColunas}
                    columnWrapperStyle={
                        numColunas > 1
                            ? styles.linha
                            : undefined
                    }
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.item}
                            onPress={() =>
                                navigation.navigate(
                                    'DetalhePonto',
                                    {
                                        pontoId: item.id,
                                    }
                                )
                            }
                        >
                            <Text style={styles.nome}>
                                {item.nome}
                            </Text>

                            <Text style={styles.horario}>
                                Horário: {item.horario}
                            </Text>

                            <Text style={styles.recebeDistribui}>
                                {item.recebe_distribui}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
    },

    cadastro: {
        margin: 16,
        marginBottom: 0,
        gap: 8,
    },

    input: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
    },

    erro: {
        color: '#C62828',
    },

    botaoCadastrar: {
        backgroundColor: '#1B3A5C',
        borderRadius: 8,
        padding: 12,
        minHeight: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },

    botaoCadastrarTexto: {
        color: '#FFFFFF',
        fontWeight: '600',
    },

    busca: {
        margin: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
    },

    linha: {
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },

    item: {
        flex: 1,
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
    },

    nome: {
        fontSize: 16,
        fontWeight: '600',
    },

    endereco: {
        fontSize: 16,
        fontWeight: '600',
    },

    horario: {
        fontSize: 14,
        marginTop: 4,
    },

    recebeDistribui: {
        fontSize: 14,
        marginTop: 4,
        fontWeight: '600',
    },
    botaoSecundario: {
        borderWidth: 1,
        borderColor: '#1B3A5C',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    botaoSecundarioTexto: {
        color: '#1B3A5C',
        fontWeight: 'bold',
    },
    botaoDoacoes: {
        backgroundColor: '#1B3A5C',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 16,
    },

    botaoDoacoesTexto: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default TelaListaPontos;