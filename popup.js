document.addEventListener("DOMContentLoaded", function () {
    function storePreferences(formId, storageKey, inputName) {
        const form = document.getElementById(formId);
        chrome.storage.local.get(storageKey, function(result) {
            const value = result[storageKey];
            if (value !== undefined) {
                const rb = form.querySelector(`input[value="${value}"]`);
                if (rb) {
                    rb.checked = true;
                }
            }
        });
        form.addEventListener("change", function (event) {
            if (event.target.name === inputName) {
                chrome.storage.local.set({ [storageKey]: event.target.value });
            }
        });
    }

    storePreferences("stForm", "sSt", "st");
    storePreferences("stComForm", "sSc", "sc");
    storePreferences("hpForm", "sHp", "hp");
});
