// Extracted unchanged from reference/brand-audit/app.js. See preservation tests.
export function calculateScore(answers) {
        try {
            let totalPoints = 0;
            
            answers.forEach(ans => {
                let points = 0;
                if (ans.value === 'yes') points = 4;
                else if (ans.value === 'no') points = 0;
                else {
                    // Scale 1-5 maps to 0-4 points
                    const scaleVal = parseInt(ans.value, 10);
                    points = scaleVal - 1; 
                }
                totalPoints += points;
            });

            // Ensure score stays strictly within 0 - 100
            totalPoints = Math.max(0, Math.min(100, totalPoints));
            
            console.log("Score calculated:", totalPoints);
            return totalPoints;
        } catch (error) {
            console.error("Score calculation error:", error);
            return 0;
        }
    }

export function generateGapSummary(answers) {
        try {
            const categories = {};
            
            // Group answers by category
            answers.forEach(ans => {
                if (!categories[ans.category]) {
                    categories[ans.category] = { totalRaw: 0, count: 0 };
                }
                
                let rawValue = 0;
                if (ans.value === 'yes') rawValue = 5;
                else if (ans.value === 'no') rawValue = 1;
                else rawValue = parseInt(ans.value, 10);
                
                categories[ans.category].totalRaw += rawValue;
                categories[ans.category].count++;
            });

            const gaps = [];
            // If average is strictly below 3, it's a gap
            for (const cat in categories) {
                const avg = categories[cat].totalRaw / categories[cat].count;
                if (avg < 3) {
                    // Capitalize category name
                    const catName = cat.charAt(0).toUpperCase() + cat.slice(1);
                    gaps.push(catName);
                }
            }

            return gaps.length > 0 ? gaps.join(', ') : 'None';
        } catch (error) {
            console.error("Gap generation error:", error);
            return 'Analysis Error';
        }
    }

export function generateDiagnosticReport(answers) {
        try {
            return answers.map(ans => ({
                question: ans.question,
                answer: ans.value.toUpperCase()
            }));
        } catch (error) {
            console.error("Report generation error:", error);
            return [];
        }
    }
