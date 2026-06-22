<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let patient;

    let editedPatient = JSON.parse(JSON.stringify(patient)); // Deep copy
    let errors = {};

    const dispatch = createEventDispatcher<{ save: typeof editedPatient; cancel: void }>();

    const validGenders = ['male', 'female', 'other', 'unknown'];

    function validate() {
        errors = {};
        if (!editedPatient.resource.name?.[0]?.given?.[0]) {
            errors.given = 'Name is required';
        }
        if (!editedPatient.resource.name?.[0]?.family) {
            errors.family = 'Last name is required';
        }
        if (!editedPatient.resource.gender || !validGenders.includes(editedPatient.resource.gender)) {
            errors.gender = 'A valid gender is required';
        }
        // Basic date validation (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!editedPatient.resource.birthDate || !dateRegex.test(editedPatient.resource.birthDate)) {
            errors.birthDate = 'Birth date must be in YYYY-MM-DD format';
        }
        return Object.keys(errors).length === 0;
    }

    function handleSave() {
        if (validate()) {
            dispatch('save', editedPatient);
        }
    }

    function handleCancel() {
        dispatch('cancel');
    }

    // Initial validation and setup for potentially missing nested objects
    if (!editedPatient.resource.name) editedPatient.resource.name = [{}];
    if (!editedPatient.resource.name[0].given) editedPatient.resource.name[0].given = [''];
    validate();
</script>

<tr>
    <td>{editedPatient.resource.id}</td>
    <td>
        <input type="text" bind:value={editedPatient.resource.name[0].given[0]} on:input={validate} class:invalid={errors.given} />
        {#if errors.given}<span class="error">{errors.given}</span>{/if}
    </td>
    <td>
        <input type="text" bind:value={editedPatient.resource.name[0].family} on:input={validate} class:invalid={errors.family} />
        {#if errors.family}<span class="error" >{errors.family}</span>{/if}
    </td>
    <td>
        <select bind:value={editedPatient.resource.gender} on:change={validate} class:invalid={errors.gender}>
            {#each validGenders as gender}
                <option value={gender}>{gender}</option>
            {/each}
        </select>
        {#if errors.gender}<span class="error">{errors.gender}</span>{/if}
    </td>
    <td>
        <input type="text" bind:value={editedPatient.resource.birthDate} on:input={validate} class:invalid={errors.birthDate} />
        {#if errors.birthDate}<span class="error">{errors.birthDate}</span>{/if}
    </td>
    <td>
        <button id="save-button" on:click={handleSave} disabled={Object.keys(errors).length > 0}>Save</button>
        <button id="cancel-button" on:click={handleCancel}>Cancel</button>
    </td>
</tr>

<style>
    input, select {
        width: 100%;
    }
    .invalid {
        border-color: red;
    }
    .error {
        color: red;
        font-size: 0.8em;
    }
    #save-button {
        background-color: rgb(174, 216, 174);
        width: 6rem;
        height: 2.5rem;
    }   
    #cancel-button {
        background-color: grey;
        width: 6rem;
        height: 2.5rem  
    }
    tr, td {
        color: #1a1a1a;
    }
</style>
