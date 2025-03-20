// 1. COMPLETE VARIABLE AND FUNCTION DEFINITIONS
const customName = document.getElementById('customname');
const randomize = document.querySelector('.randomize');
const story = document.querySelector('.story');

function randomValueFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// 2. RAW TEXT STRINGS
const storyText =
':insertx: was feeling tired so :insertx: went to :inserty:, and regretted it. So he went on a date and the date ended up :insertz:. The date slapped him across the face, called him names, stopped on his foot, and walked away, blaming him for the accident.'
const insertX = [
  'Goop the Destroyer',
  'Drake',
  'Danny',
];

const insertY = [
  'the gym',
  'bed',
  'the mall',
];

const insertZ = [
  'falling into a puddle',
  'vomiting from drinking too much',
  'having a stroke',
];

// 3. EVENT LISTENER AND PARTIAL FUNCTION DEFINITION
randomize.addEventListener('click', result);

function result() {
  // Create a new story each time
  let newStory = storyText;

  // Replace placeholders with random values
  const xItem = randomValueFromArray(insertX);
  const yItem = randomValueFromArray(insertY);
  const zItem = randomValueFromArray(insertZ);

  newStory = newStory.replaceAll(':insertx:', xItem);
  newStory = newStory.replace(':inserty:', yItem);
  newStory = newStory.replace(':insertz:', zItem);

  // Replace "Bob" with custom name if provided
  if (customName.value !== '') {
    const name = customName.value;
    newStory = newStory.replace('Bob', name);
  }

  // Convert units if UK is selected
  if (document.getElementById('uk').checked) {
    const weight = `${Math.round(300 / 14)} stone`;
    const temperature = `${Math.round((94 - 32) * (5 / 9))} centigrade`;

    newStory = newStory.replace('300 pounds', weight);
    newStory = newStory.replace('94 fahrenheit', temperature);
  }

  // Display the story
  story.textContent = newStory;
  story.style.visibility = 'visible';
}