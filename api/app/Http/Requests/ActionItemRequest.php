<?php

namespace App\Http\Requests;

use App\Models\Relationship;
use Illuminate\Foundation\Http\FormRequest;

class ActionItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $relationship = Relationship::findOrFail($this->request->get('relationship_id'));

        return $this->user()->can('view', $relationship);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'action' => 'required|min:10|max:50',
            'complete' => 'boolean',
            'relationship_id' => ['required', 'string'],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'action.min' => 'The action item must be at least 10 characters.',
            'action.max' => 'Action items must be less than 50 characters.',
            'relationship_id' => 'There was no relationship provided for the action item.',
        ];
    }
}
