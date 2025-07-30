document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const schmotifyBtn = document.getElementById('schmotifyBtn');
    const copyBtn = document.getElementById('copyBtn');
    const easterEggImage = document.getElementById('easterEggImage');
    const easterEggSound = document.getElementById('easterEggSound');

    // Schmotify function - adds "schm" prefix to each word
    function schmotifyText(text) {
        if (!text.trim()) return '';

        // Split text into words while preserving punctuation and spacing
        // Updated regex to handle apostrophes in contractions like "it's", "don't", etc.
        return text.replace(/\b[a-zA-Z]+(?:'[a-zA-Z]+)?\b/g, function(word) {
            // Check if the original word starts with a capital letter
            const isCapitalized = /^[A-Z]/.test(word);
            
            // Helper function to apply correct capitalization to "schm" prefix
            function getSchmPrefix(isCapital) {
                return isCapital ? 'Schm' : 'schm';
            }
            
            // If word starts with a vowel (including y when it sounds like a vowel), just add "schm" prefix
            if (/^[aeiou]/i.test(word)) {
                const schmPrefix = getSchmPrefix(isCapitalized);
                const restOfWord = isCapitalized ? word.charAt(0).toLowerCase() + word.slice(1) : word;
                return schmPrefix + restOfWord;
            }
            
            // Handle contractions by processing only the first part before apostrophe
            if (word.includes("'")) {
                const parts = word.split("'");
                const firstPart = parts[0];
                const restParts = parts.slice(1).join("'");
                const isFirstPartCapitalized = /^[A-Z]/.test(firstPart);
                
                // Process the first part
                let processedFirstPart;
                if (/^[aeiou]/i.test(firstPart)) {
                    const schmPrefix = getSchmPrefix(isFirstPartCapitalized);
                    const restOfFirstPart = isFirstPartCapitalized ? firstPart.charAt(0).toLowerCase() + firstPart.slice(1) : firstPart;
                    processedFirstPart = schmPrefix + restOfFirstPart;
                } else {
                    const vowelMatch = firstPart.match(/[aeiouy]/i);
                    if (vowelMatch) {
                        const vowelIndex = vowelMatch.index;
                        const schmPrefix = getSchmPrefix(isFirstPartCapitalized);
                        const restOfFirstPart = firstPart.substring(vowelIndex);
                        processedFirstPart = schmPrefix + restOfFirstPart;
                    } else {
                        const schmPrefix = getSchmPrefix(isFirstPartCapitalized);
                        processedFirstPart = schmPrefix + firstPart.toLowerCase();
                    }
                }
                
                return processedFirstPart + "'" + restParts;
            }
            
            // If word starts with consonant(s), replace ALL beginning consonants with "schm"
            // Find the first vowel position (including y as vowel)
            const vowelMatch = word.match(/[aeiouy]/i);
            if (vowelMatch) {
                const vowelIndex = vowelMatch.index;
                const schmPrefix = getSchmPrefix(isCapitalized);
                // Replace all consonants before first vowel with "schm"
                return schmPrefix + word.substring(vowelIndex);
            }
            
            // If no vowels found (unlikely), just add schm prefix
            const schmPrefix = getSchmPrefix(isCapitalized);
            return schmPrefix + word.toLowerCase();
        });
    }

    // Event listeners
    schmotifyBtn.addEventListener('click', function() {
        const input = inputText.value;
        const cleanInput = input.trim().toLowerCase().replace(/\?$/, '');
        const triggerPhrases = ['is this loss', 'loss'];

        if (triggerPhrases.includes(cleanInput)) {
            // Trigger the Easter Egg
            easterEggImage.classList.add('active');
            easterEggSound.currentTime = 0; // Rewind sound to the start
            easterEggSound.play();
            return; // Skip the schmotify logic
        }
        
        if (!input.trim()) {
            alert('Please enter some text to schmotify!');
            return;
        }

        // Add loading state
        document.body.classList.add('loading');
        schmotifyBtn.innerHTML = 'Schmotifying...';

        // Simulate processing time for better UX
        setTimeout(() => {
            const schmotified = schmotifyText(input);
            
            outputText.innerHTML = `<p>${schmotified}</p>`;
            outputText.classList.add('has-content');
            copyBtn.style.display = 'block';

            // Remove loading state
            document.body.classList.remove('loading');
            schmotifyBtn.innerHTML = 'Schmotify It!';
        }, 800);
    });

    // Copy to clipboard functionality
    copyBtn.addEventListener('click', function() {
        const textToCopy = outputText.textContent;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = 'Copied!';
            copyBtn.style.background = '#38a169';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.background = '#28a745';
            }, 2000);
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = 'Copied!';
            copyBtn.style.background = '#38a169';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.background = '#28a745';
            }, 2000);
        });
    });

    // Hide Easter egg when the image is clicked
    easterEggImage.addEventListener('click', function() {
        easterEggImage.classList.remove('active');
        easterEggSound.pause();
    });

    // Allow Enter key to trigger schmoozify (with Ctrl/Cmd)
    inputText.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            schmotifyBtn.click();
        }
    });

    // Auto-resize textarea
    inputText.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 300) + 'px';
    });
});
