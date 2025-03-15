<?php

namespace App\Http\Requests;

use App\Models\ActionItem;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

final class ActionItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var ActionItem|null $actionItem */
        $actionItem = $this->route('action_item');

        if (!$actionItem) {
            return true; // If there is no ActionItem, this is a create new (store)
        }

        $relationship = $actionItem?->relationship;

        return $this->user()->can('view', $relationship);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
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
