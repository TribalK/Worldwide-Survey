document.querySelector('#beginSurvey').addEventListener('click', beginSurvey);
document.querySelector('#menToSurvey').addEventListener('change', reformatNumber);
document.querySelector('#womenToSurvey').addEventListener('change', reformatNumber);

function reformatNumber() {
  if(this.value > 1000) {
    this.value = 1000;
  } else if(this.value < 0) {
    this.value = 0;
  }
}

async function beginSurvey() {
  let arrMaleAnswers = await getMaleSurveyAnswers();
  let arrFemaleAnswers = await getFemaleSurveyAnswers();
  let arrSurveyAnswers = arrMaleAnswers.concat(arrFemaleAnswers);

  arrSortedSurveyAnswers = arrSurveyAnswers.sort((a,b) => {
    if(a.lastname > b.lastname) {
      return 1;
    } else if(a.lastname < b.lastname) {
      return -1;
    } else {
      return a.firstname > b.firstname ? 1 : -1;
    }
  });

  /*  for(key of arrSortedSurveyAnswers) {
      console.log(`${key.firstname} ${key.lastname}`);
    } */

    //Get list of all countries that the surveyed subjects are from
     let objCountrySurvey = arrSortedSurveyAnswers.reduce((object, countryName) => {
      if(object[countryName.address.country] >= 1) {
          object[countryName.address.country]++;
      } else {
          object[countryName.address.country] = 1
      }

      return object;
    },{})

    let largestGroupCnt = 0;
    let largestGroup = "N/A";
    for(country in objCountrySurvey) {
      if(objCountrySurvey[country] > largestGroupCnt) {
        largestGroup = country;
        largestGroupCnt = objCountrySurvey[country];
      } else if(objCountrySurvey[country] === largestGroupCnt) {
        largestGroup = `${largestGroup}, ${country}`;
      }
    }

    document.querySelector('h2').innerText = `The countries with the most residents are: ${largestGroup}`;
  }

async function getMaleSurveyAnswers() {
  const surveyMaleCount = document.querySelector('#menToSurvey').value;

  if(surveyMaleCount > 0) {

    const json = await caller(surveyMaleCount, 'male');

    return json.data;
  } else {
    return [];
  }
}

async function caller(count, gender) {
  return fetch(`https://fakerapi.it/api/v1/persons?_quantity=${count}&_gender=${gender}`)
  .then(res => {
    return res.json();
  })
}

async function getFemaleSurveyAnswers() {
  const surveyFemaleCount = document.querySelector('#womenToSurvey').value;

  if(surveyFemaleCount > 0) {
    const json = await caller(surveyFemaleCount, 'female');

    return json.data;
  } else {
    return [];
  }
}
