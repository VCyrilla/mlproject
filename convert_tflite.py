import tensorflow as tf

# Load your trained model
model = tf.keras.models.load_model('lstm/lstm_malware_final.h5')

# Create converter with fixes
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
converter.target_spec.supported_ops = [
    tf.lite.OpsSet.TFLITE_BUILTINS,
    tf.lite.OpsSet.SELECT_TF_OPS
]
converter._experimental_lower_tensor_list_ops = False

# Convert
tflite_model = converter.convert()

# Save
with open('lstm/lstm_malware_final.tflite', 'wb') as f:
    f.write(tflite_model)

print("TFLite model saved successfully! (~5 MB)")