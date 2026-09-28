import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import type { Ponto } from './TelaListaPontos';

type Props = {
    route: {
        params?: {
            pontoId: string;
        };
    };
    navigation: any;
    pontos: Ponto[];
};

function DetalhePonto({ ponto }: { ponto: Ponto }) {
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>
                Detalhes do Ponto
            </Text>

            <Text style={styles.endereco}>
                {ponto.endereco}
            </Text>

            <Text style={styles.horario}>
                Horário: {ponto.horario}
            </Text>

            <Text style={styles.recebeDistribui}>
                {ponto.recebe_distribui}
            </Text>
        </View>
    );
}

function TelaDetalhePonto({
    route,
    navigation,
    pontos,
}: Props) {
    const pontoId = route.params?.pontoId;

    const ponto = pontos.find(
        (item) => item.id === pontoId
    );

    if (!ponto) {
        return (
            <View style={styles.container}>
                <Text style={styles.titulo}>
                    Ponto não encontrado.
                </Text>

                <TouchableOpacity
                    style={styles.voltar}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.voltarTexto}>
                        Voltar
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return <DetalhePonto ponto={ponto} />;
}

export default TelaDetalhePonto;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },

    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1B3A5C',
        marginBottom: 20,
    },

    endereco: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1B3A5C',
    },

    horario: {
        fontSize: 18,
        color: '#4A4A4A',
        marginTop: 12,
    },

    recebeDistribui: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2E7D32',
        marginTop: 12,
    },

    voltar: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignSelf: 'flex-start',
    },

    voltarTexto: {
        color: '#000000',
        fontWeight: 'bold',
    },
});
