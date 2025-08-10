import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { v4 as uuidv4 } from 'uuid';

// Define the Field type
export interface Field {
  id: string;
  type: string;
  label: string;
  alias?: string;  
  required: boolean;
  defaultValue?: string | number;
  validation?: {
    notEmpty?: boolean;
    minLength?: number;
    maxLength?: number;
    email?: boolean;
    passwordRule?: boolean;
  };
  derived?: {
    parents: string[];
    formula: string;
  };
}

// Define the SavedForm type
export interface SavedForm {
  id: string;
  name: string;
  fields: Field[];
  createdAt: string;
}

// Define the state interface
interface FormBuilderState {
  fields: Field[];
  formName: string;
  savedForms: SavedForm[];
}

// Load saved forms from localStorage or start with empty array
const initialState: FormBuilderState = {
  fields: [],
  formName: '',
  savedForms: JSON.parse(localStorage.getItem('savedForms') || '[]'),
};

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    addField(state, action: PayloadAction<Field>) {
      state.fields.push(action.payload);
    },
    updateField(state, action: PayloadAction<Field>) {
      const index = state.fields.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.fields[index] = action.payload;
      }
    },
    removeField(state, action: PayloadAction<string>) {
      state.fields = state.fields.filter(f => f.id !== action.payload);
    },
    setFormName(state, action: PayloadAction<string>) {
      state.formName = action.payload;
    },
    saveForm(state) {
      if (!state.formName.trim()) return;

      const newForm: SavedForm = {
        id: uuidv4(),
        name: state.formName,
        fields: state.fields,
        createdAt: new Date().toISOString(),
      };

      state.savedForms.push(newForm);

      // Persist saved forms to localStorage
      localStorage.setItem('savedForms', JSON.stringify(state.savedForms));

      // Reset current form fields and form name
      state.fields = [];
      state.formName = '';
    },
    resetForm(state) {
      state.fields = [];
      state.formName = '';
    },

    // New reducer for reordering fields
    reorderFields(state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) {
      const { fromIndex, toIndex } = action.payload;
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.fields.length ||
        toIndex >= state.fields.length
      ) {
        return; // Invalid indexes; do nothing
      }
      const updatedFields = [...state.fields];
      const [movedField] = updatedFields.splice(fromIndex, 1);
      updatedFields.splice(toIndex, 0, movedField);
      state.fields = updatedFields;
    },
  },
});

export const {
  addField,
  updateField,
  removeField,
  setFormName,
  saveForm,
  resetForm,
  reorderFields,  // <-- export reorderFields here
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;
