// Game state variables
        let randomNumber;
        let prevGuess = [];
        let numGuess = 1;
        let playGame = true;
        let maxAttempts = 10;
        let minRange = 1;
        let maxRange = 1000;
        let currentMode = 'hard';
        
        // DOM elements
        const submit = document.querySelector('#subt');
        const userInput = document.querySelector('#guessField');
        const guessSlot = document.querySelector('.guesses');
        const remaining = document.querySelector('.lastResult');
        const lowOrHi = document.querySelector('.lowOrHi');
        const minRangeEl = document.querySelector('#min-range');
        const maxRangeEl = document.querySelector('#max-range');
        const attemptsCountEl = document.querySelector('#attempts-count');
        const modal = document.querySelector('#message-modal');
        const modalTitle = document.querySelector('#modal-title');
        const modalMessage = document.querySelector('#modal-message');
        const playAgainBtn = document.querySelector('#play-again');
        const changeModeBtn = document.querySelector('#change-mode');
        const difficultyBtns = document.querySelectorAll('.difficulty-btn');
        
        // Initialize the game
        initGame();
        
        // Event listeners
        submit.addEventListener('click', function(e) {
            e.preventDefault();
            if (playGame) {
                const guess = parseInt(userInput.value);
                validateGuess(guess);
            }
        });
        
        playAgainBtn.addEventListener('click', function() {
            modal.classList.remove('active');
            resetGame();
        });
        
        changeModeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
            resetGame();
        });
        
        // Add event listeners to difficulty buttons
        difficultyBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                difficultyBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                // Set the current mode
                currentMode = this.getAttribute('data-mode');
                // Update game settings based on mode
                updateModeSettings();
                // Reset the game with new settings
                resetGame();
            });
        });
        
        // Initialize the game
        function initGame() {
            randomNumber = generateRandomNumber(minRange, maxRange);
            updateModeSettings();
        }
        
        // Update game settings based on selected mode
        function updateModeSettings() {
            switch(currentMode) {
                case 'normal':
                    minRange = 1;
                    maxRange = 100;
                    maxAttempts = 10;
                    break;
                case 'medium':
                    minRange = 1;
                    maxRange = 1000;
                    maxAttempts = 12;
                    break;
                case 'hard':
                    minRange = 1;
                    maxRange = 100000;
                    maxAttempts = 15;
                    break;
            }
            
            // Update UI to reflect current settings
            minRangeEl.textContent = minRange;
            maxRangeEl.textContent = maxRange;
            attemptsCountEl.textContent = maxAttempts;
            remaining.textContent = maxAttempts;
            
            // Set input field attributes
            userInput.min = minRange;
            userInput.max = maxRange;
            userInput.placeholder = `Enter ${minRange}-${maxRange}`;
        }
        
        // Generate random number based on current range
        function generateRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        
        // Validate the user's guess
        function validateGuess(guess) {
            if (isNaN(guess)) {
                displayMessage('Please enter a valid number', 'error');
            } else if (guess < minRange || guess > maxRange) {
                displayMessage(`Please enter a number between ${minRange} and ${maxRange}`, 'error');
            } else {
                prevGuess.push(guess);
                if (numGuess >= maxAttempts) {
                    displayGuess(guess);
                    endGame(false);
                } else {
                    displayGuess(guess);
                    checkGuess(guess);
                }
            }
        }
        
        // Check if the guess is correct
        function checkGuess(guess) {
            if (guess === randomNumber) {
                displayMessage(`Congratulations! You guessed it right!`, 'success');
                showCelebration();
                endGame(true);
            } else if (guess < randomNumber) {
                displayMessage(`Number is too low`, 'info');
            } else if (guess > randomNumber) {
                displayMessage(`Number is too high`, 'info');
            }
        }
        
        // Display the guess and update UI
        function displayGuess(guess) {
            userInput.value = '';
            guessSlot.textContent = prevGuess.join(', ');
            remaining.textContent = maxAttempts - numGuess;
            numGuess++;
        }
        
        // Display messages to the user
        function displayMessage(message, type) {
            lowOrHi.textContent = message;
            lowOrHi.className = 'lowOrHi';
            lowOrHi.classList.add(type);
        }
        
        // End the game
        function endGame(isWin) {
            userInput.disabled = true;
            submit.disabled = true;
            playGame = false;
            
            // Show modal with appropriate message
            if (isWin) {
                modalTitle.textContent = 'Congratulations!';
                modalMessage.textContent = `You guessed the number ${randomNumber} in ${numGuess-1} attempts!`;
            } else {
                modalTitle.textContent = 'Game Over!';
                modalMessage.textContent = `The correct number was ${randomNumber}. Better luck next time!`;
            }
            
            modal.classList.add('active');
        }
        
        // Reset the game
        function resetGame() {
            // Reset game state
            prevGuess = [];
            numGuess = 1;
            playGame = true;
            
            // Generate new random number
            randomNumber = generateRandomNumber(minRange, maxRange);
            
            // Reset UI
            guessSlot.textContent = '';
            remaining.textContent = maxAttempts;
            lowOrHi.textContent = '';
            lowOrHi.className = 'lowOrHi';
            userInput.value = '';
            userInput.disabled = false;
            submit.disabled = false;
            userInput.focus();
        }
        
        // Celebration effects for winning
        function showCelebration() {
            const wrapper = document.getElementById('wrapper');
            
            // Create confetti
            for (let i = 0; i < 150; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.animationDelay = Math.random() * 5 + 's';
                confetti.style.background = getRandomColor();
                wrapper.appendChild(confetti);
                
                // Remove confetti after animation
                setTimeout(() => {
                    confetti.remove();
                }, 5000);
            }
            
            // Create fireworks
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    createFirework();
                }, i * 150);
            }
        }
        
        // Create a firework effect
        function createFirework() {
            const wrapper = document.getElementById('wrapper');
            const centerX = 50; // Center of wrapper
            const centerY = 30; // Center of wrapper
            
            for (let i = 0; i < 100; i++) {
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * 100;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                
                const firework = document.createElement('div');
                firework.className = 'firework';
                firework.style.setProperty('--x', (x - 50) + 'px');
                firework.style.setProperty('--y', (y - 30) + 'px');
                firework.style.background = getRandomColor();
                wrapper.appendChild(firework);
                
                // Remove firework after animation
                setTimeout(() => {
                    firework.remove();
                }, 1000);
            }
        }
        
        // Helper to get random color
        function getRandomColor() {
            const colors = ['#FF5252', '#FFD740', '#7C4DFF', '#18FFFF', '#69F0AE', '#FF4081'];
            return colors[Math.floor(Math.random() * colors.length)];
        }