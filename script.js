document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const schmotifyBtn = document.getElementById('schmotifyBtn');
    const copyBtn = document.getElementById('copyBtn');
    const easterEggImage = document.getElementById('easterEggImage');
    const easterEggSound = document.getElementById('easterEggSound');
    const turbulence = document.querySelector('#wavy feTurbulence');
    let wavyAnimation;


    // Schmotify function - adds "schm" prefix to each word
    function schmotifyText(text) {
        if (!text.trim()) return '';

        // Split text into words while preserving punctuation and spacing
        // Updated regex to properly handle contractions like "it's", "don't", "I'm", etc.
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
            
            // Handle contractions
            if (word.includes("'")) {
                // Special case for "I'm" - transform to "Schmi'm"
                if (word.toLowerCase() === "i'm") {
                    return word[0] === 'I' ? "Schmi'm" : "schmi'm";
                }
                
                // For other contractions, process the entire word as one unit
                const isCapitalized = /^[A-Z]/.test(word);
                const schmPrefix = getSchmPrefix(isCapitalized);
                
                // Find first vowel in the entire word
                const vowelMatch = word.match(/[aeiouy]/i);
                if (vowelMatch) {
                    const vowelIndex = vowelMatch.index;
                    const restOfWord = word.substring(vowelIndex);
                    return schmPrefix + restOfWord.toLowerCase();
                }
                return schmPrefix + word.toLowerCase();
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
            document.body.classList.add('wavy-active');
            easterEggImage.classList.add('active');
            easterEggSound.currentTime = 0; // Rewind sound to the start
            easterEggSound.play();

            let seed = 0;
            function animateWavy() {
                seed += 0.02;
                turbulence.setAttribute('seed', seed);
                wavyAnimation = requestAnimationFrame(animateWavy);
            }
            animateWavy();

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
        document.body.classList.remove('wavy-active');
        easterEggImage.classList.remove('active');
        easterEggSound.pause();
        cancelAnimationFrame(wavyAnimation);
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
