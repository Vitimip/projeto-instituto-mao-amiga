import {
    Alert,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import { excluirDoacao } from './doacoesStorage';
import { Ponto } from './TelaListaPontos';

type Props = NativeStackScreenProps<
    RootStackParamList,
    'DetalheDoacao'
> & {
    pontos: Ponto[];
};

export default function TelaDetalheDoacao({
    navigation,
    route,
    pontos,
}: Props) {
    const doacao = route.params.doacao;

    const ponto = pontos.find(
        (item) => item.id === doacao.pontoDestinoId
    );

    async function confirmarExclusao() {
        if (Platform.OS === 'web') {
            const confirmou = window.confirm(
                'Tem certeza que deseja excluir esta doação?'
            );

            if (!confirmou) {
                return;
            }

            await excluirDoacao(doacao.id);
            navigation.goBack();
            return;
        }

        Alert.alert(
            'Excluir doação',
            'Tem certeza que deseja excluir esta doação?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        await excluirDoacao(doacao.id);
                        navigation.goBack();
                    },
                },
            ]
        );
    }

    function editar() {
        navigation.navigate('CadastroDoacao', {
            doacao: doacao,
        });
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titulo}>
                Detalhe da doação
            </Text>

            <View style={styles.card}>
                <Text style={styles.rotulo}>
                    Tipo do item
                </Text>

                <Text style={styles.valor}>
                    {doacao.tipoItem}
                </Text>

                <Text style={styles.rotulo}>
                    Quantidade
                </Text>

                <Text style={styles.valor}>
                    {doacao.quantidade}
                </Text>

                <Text style={styles.rotulo}>
                    Ponto de destino
                </Text>

                <Text style={styles.valor}>
                    {ponto?.nome ?? 'Ponto não encontrado'}
                </Text>

                <Text style={styles.rotulo}>
                    Data do registro
                </Text>

                <Text style={styles.valor}>
                    {new Date(doacao.criadoEm).toLocaleString('pt-BR')}
                </Text>
            </View>

            <TouchableOpacity
                style={styles.botaoEditar}
                onPress={editar}
                activeOpacity={0.7}
            >
                <Text style={styles.botaoEditarTexto}>
                    Editar doação
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.botaoExcluir}
                onPress={confirmarExclusao}
                activeOpacity={0.7}
            >
                <Text style={styles.botaoExcluirTexto}>
                    Excluir doação
                </Text>
            </TouchableOpacity>
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
    card: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 16,
    },
    rotulo: {
        fontSize: 13,
        color: '#757575',
        marginTop: 10,
        marginBottom: 4,
    },
    valor: {
        fontSize: 16,
        color: '#222222',
    },
    botaoEditar: {
        backgroundColor: '#1B3A5C',
        borderRadius: 8,
        minHeight: 44,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        cursor: 'pointer',
    },
    botaoEditarTexto: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    botaoExcluir: {
        backgroundColor: '#C62828',
        borderRadius: 8,
        minHeight: 44,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        cursor: 'pointer',
    },
    botaoExcluirTexto: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});
