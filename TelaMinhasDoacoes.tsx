import React, { useCallback, useMemo, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    FlatList,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from './App';
import { listarDoacoes, Doacao } from './doacoesStorage';
import { Ponto } from './TelaListaPontos';

type Props = NativeStackScreenProps<RootStackParamList, 'MinhasDoacoes'> & {
    pontos: Ponto[];
};

type ResumoDoacao = {
    tipoItem: string;
    quantidade: number;
    quantidadeDoacoes: number;
};

const ItemDoacao = ({ doacao, nomePonto }: { doacao: Doacao; nomePonto: string }) => {
    return (
        <View style={styles.doacao}>
            <Text style={styles.tipo}>
                Tipo: {doacao.tipoItem}
            </Text>

            <Text style={styles.quantidade}>
                Quantidade: {doacao.quantidade}
            </Text>

            <Text style={styles.ponto}>
                Ponto: {nomePonto}
            </Text>

            <Text style={styles.data}>
                Data: {new Date(doacao.criadoEm).toLocaleString('pt-BR')}
            </Text>
        </View>
    );
};

const ItemDoacaoMemo = React.memo(ItemDoacao);

export default function TelaMinhasDoacoes({ navigation, pontos }: Props) {
    const [doacoes, setDoacoes] = useState<Doacao[]>([]);
    const [busca, setBusca] = useState('');

    const carregarDoacoes = useCallback(async () => {
        const doacoesSalvas = await listarDoacoes();
        setDoacoes(doacoesSalvas);
    }, []);

    useFocusEffect(
        useCallback(() => {
            carregarDoacoes();
        }, [carregarDoacoes])
    );

    const doacoesFiltradas = useMemo(() => {
        const textoBusca = busca.trim().toLowerCase();

        if (!textoBusca) {
            return doacoes;
        }

        return doacoes.filter((doacao) =>
            doacao.tipoItem.toLowerCase().includes(textoBusca)
        );
    }, [doacoes, busca]);

    const resumoDoacoes = useMemo<ResumoDoacao[]>(() => {
        const resumo = new Map<string, ResumoDoacao>();

        doacoes.forEach((doacao) => {
            const chave = doacao.tipoItem.trim().toLowerCase();
            const tipoExistente = resumo.get(chave);

            if (tipoExistente) {
                tipoExistente.quantidade += doacao.quantidade;
                tipoExistente.quantidadeDoacoes += 1;
            } else {
                resumo.set(chave, {
                    tipoItem: doacao.tipoItem.trim(),
                    quantidade: doacao.quantidade,
                    quantidadeDoacoes: 1,
                });
            }
        });

        return Array.from(resumo.values()).sort(
            (a, b) => b.quantidade - a.quantidade
        );
    }, [doacoes]);

    function nomePonto(id: string) {
        return pontos.find((ponto) => ponto.id === id)?.nome ?? 'Ponto não encontrado';
    }

    if (doacoes.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.titulo}>
                    Minhas doações
                </Text>

                <View style={styles.resumoVazio}>
                    <Text style={styles.resumoTitulo}>
                        Resumo das doações
                    </Text>

                    <Text style={styles.mensagem}>
                        Nenhuma doação registrada ainda.
                    </Text>
                </View>

                <View style={styles.vazio}>
                    <Text style={styles.mensagem}>
                        Você ainda não registrou nenhuma doação.
                    </Text>

                    <TouchableOpacity
                        style={styles.botao}
                        onPress={() => navigation.navigate('CadastroDoacao')}
                    >
                        <Text style={styles.botaoTexto}>
                            Registrar doação
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.teclado}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <Text style={styles.titulo}>
                    Minhas doações
                </Text>

                <TextInput
                    style={styles.campoBusca}
                    value={busca}
                    onChangeText={setBusca}
                    placeholder="Buscar por tipo de item"
                    placeholderTextColor="#757575"
                    returnKeyType="search"
                />

                <View style={styles.resumo}>
                    <Text style={styles.resumoTitulo}>
                        Resumo das doações
                    </Text>

                    <Text style={styles.totalDoacoes}>
                        Total de doações: {doacoes.length}
                    </Text>

                    {resumoDoacoes.map((item) => (
                        <Text
                            key={item.tipoItem.toLowerCase()}
                            style={styles.itemResumo}
                        >
                            {item.tipoItem}: {item.quantidade} unidades em {item.quantidadeDoacoes} doações
                        </Text>
                    ))}
                </View>

                {doacoesFiltradas.length === 0 ? (
                    <View style={styles.vazioBusca}>
                        <Text style={styles.mensagem}>
                            Nenhuma doação encontrada para "{busca}".
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={doacoesFiltradas}
                        keyExtractor={(item, index) =>
                            item.id?.toString() ?? index.toString()
                        }
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate('DetalheDoacao', {
                                        doacao: item,
                                    })
                                }
                            >
                                <ItemDoacaoMemo
                                    doacao={item}
                                    nomePonto={nomePonto(item.pontoDestinoId)}
                                />
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={styles.lista}
                    />
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    teclado: {
        flex: 1,
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1B3A5C',
        marginBottom: 12,
    },
    campoBusca: {
        height: 48,
        borderWidth: 1,
        borderColor: '#BDBDBD',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#222222',
        marginBottom: 12,
    },
    resumo: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        backgroundColor: '#F8F9FA',
    },
    resumoVazio: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        backgroundColor: '#F8F9FA',
    },
    resumoTitulo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1B3A5C',
        marginBottom: 8,
    },
    totalDoacoes: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
    },
    itemResumo: {
        fontSize: 14,
        marginTop: 4,
    },
    lista: {
        paddingBottom: 16,
    },
    doacao: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    tipo: {
        fontSize: 16,
        fontWeight: '600',
    },
    quantidade: {
        fontSize: 14,
        marginTop: 4,
    },
    ponto: {
        fontSize: 14,
        marginTop: 4,
        fontWeight: '600',
    },
    data: {
        fontSize: 13,
        color: '#757575',
        marginTop: 4,
    },
    vazio: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    vazioBusca: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    mensagem: {
        fontSize: 16,
        color: '#757575',
        textAlign: 'center',
        marginBottom: 16,
    },
    botao: {
        backgroundColor: '#1B3A5C',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    botaoTexto: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});


