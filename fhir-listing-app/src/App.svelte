<script lang="ts">
  import PatientList from './PatientList.svelte';
  import CreatePatient from './CreatePatient.svelte';
  import clinic_logo from './assets/images/clinic_logo.png';

  let tabs = [
    { name: "Show my patients",
      action: "click_patients", 
      comp: PatientList
    },
    { name: "+ Register a patient",
      action: "click_register",
      comp: CreatePatient
    }
  ]
  let cur = null;
  let componentKey = 0;

  function handlePatientCreated() {
    cur = tabs[0];
    componentKey += 1; // Change key to force re-creation
  }
 
  async function handleOnClickEvent(tab: { name: string, action: string; }) {
    // Set tab
    cur = tab
    if (tab.action == "click_patients") {
      
    }
    else if (tab.action == "click_register"){

    }
  }

</script>



<main>
  <div class="max-w-md mx-auto my-10">
    <img src={clinic_logo} height="100">
    
    <h1 class="text-2xl"> Welcome again, Dr. Doe </h1>
    
    {#each tabs as tab}
        <button class:selected={cur === tab} on:click={ (e) => handleOnClickEvent(tab)}>
            {tab.name}
        </button>
    {/each}
    {#if cur}
      {#key componentKey}
        <svelte:component this={cur.comp} on:patientCreated={handlePatientCreated} on:cancel={() => cur = tabs[0]} />
      {/key}
    {/if}
   
  </div>
</main>


