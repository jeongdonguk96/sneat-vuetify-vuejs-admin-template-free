<template>
    <v-dialog v-model="isDialogVisible" max-width="600px">
        <v-card>
            <v-card-title class="text-h5">{{ title }}</v-card-title> <br>
            <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field
                        v-for="(field, index) in formFields"
                        :key="index"
                        :label="field.label"
                        v-model="formData[field.name]"
                        :rules="field.rules"
                        @blur="validateField(field.name)"
                    />
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" variant="outlined" text @click="closeDialog">취소</v-btn>
                <v-btn color="blue darken-1" variant="outlined" text @click="save" :disabled="!valid">저장</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="js">
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
    modelValue: Boolean,
    title: String,
    formFields: Array,
});

const emit = defineEmits(['update:modelValue', 'save']);

const isDialogVisible = ref(props.modelValue);
const valid = ref(true);
const formData = ref({});

watch(() => props.modelValue, (newVal) => {
    isDialogVisible.value = newVal;
    resetForm();
});

watch(isDialogVisible, (newVal) => {
    emit('update:modelValue', newVal);
});

const resetForm = () => {
    formData.value = {};
    props.formFields.forEach(field => {
        formData.value[field.name] = '';
    });
};

const validateField = (name) => {
    const field = props.formFields.find(field => field.name === name);
    if (field && field.rules) {
        const rules = field.rules;
        valid.value = rules.every(rule => rule(formData.value[name]));
    }
};

const save = () => {
    if (valid.value) {
        emit('save', formData.value);
        closeDialog();
    }
};

const closeDialog = () => {
    isDialogVisible.value = false;
};
</script>
