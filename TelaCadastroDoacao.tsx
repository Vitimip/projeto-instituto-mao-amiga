import { useEffect, useState } from 'react';
import {
    Keyboard,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    FlatList
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ponto } from './TelaListaPontos';
import { RootStackParamList } from './App';
import {
    listarDoacoes,
    salvarDoacao,
    atualizarDoacao,
} from './doacoesStorage';

export type Doacao = {
    id: number;
    tipoItem: string;
    quantidade: number;
    pontoDestinoId: string;
    criadoEm: string;
};

type Props = NativeStackScreenProps<RootStackParamList, 'CadastroDoacao'> & {
    pontos: Ponto[];
};

export default function TelaCadastroDoacao({
                                               pontos,
                                               route,
                                               navigation,
                                           }: Props) {
    const doacaoEditando = route.params?.doacao;
    const modoEdicao = !!doacaoEditando;
    const [tipoItem, setTipoItem] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [pontoDestinoId, setPontoDestinoId] = useState<string | null>(null);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState(false);
    const [doacoes, setDoacoes] = useState<Doacao[]>([]);

    useEffect(() => {
        if (doacaoEditando) {
            setTipoItem(doacaoEditando.tipoItem);
            setQuantidade(doacaoEditando.quantidade.toString());
            setPontoDestinoId(doacaoEditando.pontoDestinoId);
        }
    }, [doacaoEditando]);

    async function validar() {
        setSucesso(false);

        if (tipoItem.trim() === '') {
            setErro('Informe o tipo do item.');
            return;
        }

        if (
            quantidade.trim() === '' ||
            !/^\d+$/.test(quantidade.trim())
        ) {
            setErro('Quantidade deve ser um número válido.');
            return;
        }

        if (!pontoDestinoId) {
            setErro('Selecione um ponto de destino.');
            return;
        }

        const novaDoacao: Doacao = {
            id: doacaoEditando?.id ?? Date.now(),
            tipoItem: tipoItem.trim(),
            quantidade: Number(quantidade),
            pontoDestinoId: pontoDestinoId,
            criadoEm: doacaoEditando?.criadoEm ?? new Date().toISOString(),
        };

        if (modoEdicao) {
            await atualizarDoacao(novaDoacao);
            navigation.goBack();
            return;
        }

        await salvarDoacao(novaDoacao);

        setErro('');
        setSucesso(true);

        setTipoItem('');
        setQuantidade('');
        setPontoDestinoId(null);

        Keyboard.dismiss();
    }

    function nomePonto(id: string) {
        return pontos.find((ponto) => ponto.id === id)?.nome ?? 'Ponto não encontrado';
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titulo}>
                {modoEdicao ? 'Editar doação' : 'Registrar doação'}
            </Text>

            <Text style={styles.rotulo}>
                Tipo do item
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Ex.: Alimentos, roupas, higiene..."
                value={tipoItem}
                onChangeText={(texto) => {
                    setTipoItem(texto);
                    setSucesso(false);
                }}
                returnKeyType="next"
            />

            <Text style={styles.rotulo}>
                Quantidade
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Ex.: 10"
                value={quantidade}
                onChangeText={(texto) => {
                    if (texto === '' || /^\d+$/.test(texto)) {
                        setQuantidade(texto);
                        setErro('');
                    } else {
                        setErro('Quantidade deve conter apenas números.');
                    }

                    setSucesso(false);
                }}
                keyboardType="numeric"
                returnKeyType="done"
            />

            <Text style={styles.rotulo}>
                Ponto de destino
            </Text>

            <View style={styles.listaPontos}>
                {pontos.map((ponto) => {
                    const selecionado = ponto.id === pontoDestinoId;

                    return (
                        <TouchableOpacity
                            key={ponto.id}
                            style={[
                                styles.chipPonto,
                                selecionado && styles.chipPontoSelecionado,
                            ]}
                            onPress={() => {
                                setPontoDestinoId(ponto.id);
                                setSucesso(false);
                            }}
                        >
                            <Text
                                style={[
                                    styles.chipPontoTexto,
                                    selecionado &&
                                    styles.chipPontoTextoSelecionado,
                                ]}
                            >
                                {ponto.nome}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {erro !== '' && (
                <Text style={styles.erro}>
                    {erro}
                </Text>
            )}

            {sucesso && (
                <Text style={styles.sucesso}>
                    Doação registrada com sucesso!
                </Text>
            )}

            <TouchableOpacity
                style={styles.botao}
                onPress={validar}
            >
                <Text style={styles.botaoTexto}>
                    {modoEdicao ? 'Salvar alterações' : 'Registrar doação'}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.botaoCancelar}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.botaoCancelarTexto}>
                    Cancelar
                </Text>
            </TouchableOpacity>

            <Text style={styles.tituloDoacoes}>
                Doações registradas
            </Text>

            <FlatList
                data={doacoes}
                keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.doacao}>
                        <Text style={styles.tipo}>
                            Tipo: {item.tipoItem}
                        </Text>

                        <Text style={styles.quantidade}>
                            Quantidade: {item.quantidade}
                        </Text>

                        <Text style={styles.ponto}>
                            Ponto: {nomePonto(item.pontoDestinoId)}
                        </Text>
                        <Text style={styles.data}>
                            Criado em: {new Date(item.criadoEm).toLocaleString('pt-BR')}
                        </Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1B3A5C',
        marginBottom: 16,
    },
    tituloDoacoes: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1B3A5C',
        marginTop: 24,
        marginBottom: 12,
    },
    rotulo: {
        fontSize: 13,
        color: '#757575',
        marginTop: 12,
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    listaPontos: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chipPonto: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    chipPontoSelecionado: {
        backgroundColor: '#1B3A5C',
        borderColor: '#1B3A5C',
    },
    chipPontoTexto: {
        color: '#1B3A5C',
    },
    chipPontoTextoSelecionado: {
        color: '#FFFFFF',
    },
    erro: {
        color: '#C62828',
        marginTop: 12,
    },
    sucesso: {
        color: '#2E7D32',
        marginTop: 12,
    },
    botao: {
        backgroundColor: '#1B3A5C',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    botaoTexto: {
        color: '#FFFFFF',
        fontWeight: 'bold',
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
        fontSize: 16,
        fontWeight: '600',
    },
    doacao: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    data: {
        fontSize: 13,
        color: '#757575',
        marginTop: 4,
    },
    botaoCancelar: {
        borderWidth: 1,
        borderColor: '#1B3A5C',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 8,
    },

    botaoCancelarTexto: {
        color: '#1B3A5C',
        fontWeight: 'bold',
    },
});
