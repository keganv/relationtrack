<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Validator;

final class RelationshipRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if (!$relationship = $this->route('relationship')) {
            return false;
        }

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
            'type' => 'required|exists:relationship_types,id',
            'name' => 'required|max:55',
            'title' => 'required|max:55',
            'health' => 'required|numeric|min:0|max:10',
            'birthday' => 'nullable|date|before:today',
            'images' => 'nullable|array|max:10',
            'images.*' => fn (...$args) => $this->validateImages(...$args),
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
            'type' => 'The selected relationship type is invalid.',
            'images.max' => 'You may not upload more than 10 images per relationship.',
        ];
    }

    private function validateImages(string $attribute, UploadedFile $value, \Closure $fail): void
    {
        // Check for image mime types
        if (!str_starts_with($value->getMimeType(), 'image')) {
            $fail("The file {$value->getClientOriginalName()} must be a jpg, jpeg, png, bmp, or gif.");
        }

        // Check the max file size
        if ($value->getSize() > 1048576) {
            $fail("The image {$value->getClientOriginalName()} must be less than 1MB.");
        }
    }
}
