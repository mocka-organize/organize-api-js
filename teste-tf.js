import * as tf from '@tensorflow/tfjs';

console.log('✅ TensorFlow carregado com sucesso!');
console.log('Backend ativo:', tf.getBackend());
console.log('Versão TFJS:', tf.version.tfjs);

const a = tf.tensor([1, 2, 3]);
const b = tf.tensor([3, 2, 1]);
a.add(b).print();
