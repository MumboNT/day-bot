// Manning Meindel 1/3/19
//Made for the Dragon's Lair Living World Server

const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client();
var token = process.env.TOKEN;

client.login(token);

var week = 1;
var moon = 1;
var season = 1;
//Time-tracker string
var string = "";
//Forecast string
var string2 = "";
//Weather occurence string
var string3 = "";
//Temperature variables
var high = 0;
var low = 0;
//Wind speed variable
var wind = 0;
var border = "===================================\n";
//Time-tracker channel
const id = "403950001765482507";

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  var date;
  const channel = client.channels.get(id);
  client.users.get("183065668856315904").send("Type !Help for command list.");
  getLastValues();

  //Change values dynamically
  client.on('message', msg => {
   //Change week
   if (msg.content.startsWith("!Week") && msg.channel.id === id) {
     var test = msg.content.split(' ');
     var newWeek = parseInt(test[1],10);
     console.log(newWeek);
     //Invalid number
     if(newWeek > 52 || newWeek < 1 ) {
       msg.channel.send('Invalid number ' + newWeek + ': Must be between 1 and 52.');
     }
     else {
       week = newWeek;
     }
   }
   //Change moon
   if (msg.content.startsWith("!Moon") && msg.channel.id === id) {
     var test = msg.content.split(' ');
     var newMoon = parseInt(test[1],10);
     console.log(newMoon);
     //Invalid number
     if(newMoon > 8 || newMoon < 1 ) {
       msg.channel.send('Invalid number ' + newMoon + ': Must be between 1 and 52.');
     }
     else {
       moon = newMoon;
     }
   }
   //Display Current values
   if (msg.content.startsWith("!Display") && msg.channel.id === id) {
     msg.channel.send("Current values: Week: " + week + " Moon: " + moon + " Season: " + season);
   }
   //Display possible values (Moon)
   if (msg.content.startsWith("!MoonValues") && msg.channel.id === id) {
     msg.channel.send("Possible moon values:\n 1 (New Moon) <:new_moon:529421884299804692>\n 2 (Waxing Cresent) <:waxing_crescent_moon:529421976482349076>\n 3 (First Quarter) <:first_quarter_moon:529422288836231168>\n 4 (Waxing Gibbous) <:waxing_gibbous_moon:529422456096686101>\n 5 (Full Moon) <:full_moon:529422530839183370>\n 6 (Waning Gibbous) <:waning_gibbous_moon:529422592721944586>\n 7 (Last Quarter) <:last_quarter_moon:529422691682222090>\n 8 (Waning Cresent) <:waning_crescent_moon:529422909543022612>\n");
   }
   //Display possible values (Season)
   if (msg.content.startsWith("!SeasonValues") && msg.channel.id === id) {
     msg.channel.send("Possible season values:\n 1 (Winter) <1-9, 49-52>\n 2 (Spring) <10-22>\n 3 (Summer) <23-35>\n 4 (Autumn) <36-48>\n");
   }
   //Displays time until next update is posted.
   if (msg.content.startsWith("!NextUpdate") && msg.channel.id === id) {
     date = new Date();
     date.setHours(date.getHours() - 6);
     msg.channel.send( ((23-(date.getHours()))) + " Hours, " + (59 - (date.getMinutes())) + " minutes, and " + (60 - (date.getSeconds())) + " seconds until 12AM");
     msg.channel.send( (( ((23-(date.getHours()))) *60*60 + (59 - (date.getMinutes()))*60 + (60 - (date.getSeconds())) )*1000) + " milliseconds until 12AM");
   }
   //Help
   if (msg.content.startsWith("!Help") && msg.channel.id === id) {
    msg.channel.send("Commands:\n !Week <1-52>    Sets the week value to an integer entered after !Week.\n !Moon <1-8>      Sets the moon value to an integer entered after !Moon.\n !Display               Displays the current values of week, moon, and season.\n !MoonValues     Displays all possible moon values.\n !SeasonValues   Displays all possible season values.\n !NextUpdate       Displays the time until next output.\n\n Hosted through Heroku deployment.");
   }
  });

  //Check the current hour compared against 12AM. Get the time difference and convert to milliseconds. Do a timeout call to start the interval system.
  //https://en.wikipedia.org/wiki/24-hour_clock

  date = new Date();
  date.setHours(date.getHours() - 6);

  setTimeout(function(){
    timeTrackerUpdate();

    //Activates every 24 hours.
    var interval = setInterval (function () {
     timeTrackerUpdate();
     
   }, 24*3600000); // time between each interval in milliseconds

 }, (( ((23-(date.getHours()))) *60*60 + (59 - (new Date().getMinutes()))*60 + (60 - (new Date().getSeconds())) )*1000));

});

//Puts together the output  of the time-tracker and ouputs it when called.
function timeTrackerUpdate(){
  //52 weeks in a year
  //7 days per update
  //364 days total.

  //Winter season (Kuthona 1 to Calistril 28) Abadius (1-4) 4 Calistril (5-9) 5 Kuthona (49-52) 4 12 total
  if((week >= 1 && week <= 9)) {
    string = ":\n"+ border + week + "/52 Annual Weeks\n\n" + (week+4) + "/13 Winter Season\n\n";
    getMoon();
    getHolidays();
    season = 1;
  }

  if((week >= 49 && week <= 52)) {
    string = ":\n"+ border + week + "/52 Annual Weeks\n\n" + (week-9-39) + "/13 Winter Season\n\n";
    getMoon();
    getHolidays();
    season = 1;
  }

  //Spring Season (Pharast 1 to Desnus 31) Pharast (10-13) 4 Gozran (14-17) 4 Desnus (18-22) 5 13 total
  if(week >= 10 && week <= 22) {
    string = ":\n"+ border + week + "/52 Annual Weeks\n\n" + (week-9) + "/13 Spring Season\n\n";
    getMoon();
    getHolidays();
    season = 2;
  }

  //Summer Season (Sarenith 1 to Arodus 31) Sarenith (23-26) 4 Erastus (27-30) 4 Arodus (31-35) 5 13 total
  if(week >= 23 && week <= 35) {
    string = ":\n"+ border + week + "/52 Annual Weeks\n\n" + (week-9-13) + "/13 Summer Season\n\n";
    getMoon();
    getHolidays();
    season = 3;
  }

  //Autumn Season (Rova 1 to Neth 30) Rova (36-39) 4 Lamashan (40-44) 5 Neth (45-48) 4 13 total
  if(week >= 36 && week <= 48) {
    string = ":\n"+ border + week + "/52 Annual Weeks\n\n" + (week-9-26) + "/13 Autumn Season\n\n";
    getMoon();
    getHolidays();
    season = 4;
  }

  //Output message and update values
  const channel = client.channels.get(id);
  channel.send(string);
  getForecast();
  //console.log(string);
  week++;
  moon++;
  //Reset week count for end of year
  if(week > 52) {
    week = 1;
  }
  //Reset moon for end of moon cycle
  if(moon > 8) {
    moon = 1;
  }
}

//Adds holidays to the message if there are any holidays occuring on the week.
function getHolidays(){
  const channel = client.channels.get(id);
  //0-31
  //Abadius (1-4)
  if(week == 1 ) {
    string = string + "Holidays:\n 1st of Abadius: Foundation Day (Absalom)\n 6th of Abadius: Vault Day (Abadar)\n";
  }
  if(week == 3 ) {
    string = string + "Holidays:\n 20th of Abadius: Ruby Prince's Birthday (Osirion)\n";
  }

  //Calistril (5-8)
  if(week == 5) {
    string = string + "Holidays:\n 2nd of Calistril: Merrymead (Druma)\n";
  }
  if(week == 8) {
    string = string + "Holidays:\n 19th of Calistril: Treaty of Egorian (Cheliax)\n 24th of Calistril: Batul al-Alim (Qadira)\n";
  }

  //Pharast (9-13)
  if(week == 9) {
    string = string + "Holidays:\n 1st to 15th of Pharast: Vernal Carpentry Court (Andoran)\n";
  }
  if(week == 10) {
    string = string + "Holidays:\n 5th of Pharast: Day of Bones (Pharasma)\n 1st to 15th of Pharast: Vernal Carpentry Court (Andoran)\n";
  }
  if(week == 11) {
    string = string + "Holidays:\n 13th of Pharast: Kaliashahrim (Qadira)\n 1st to 15th of Pharast: Vernal Carpentry Court (Andoran)\n";
  }
  if(week == 13) {
    string = string + "Holidays:\n Vernal Equinox: Conquest Day (Nex)\n Vernal Equinox: Firstbloom (Gozreh)\n Vernal Equinox: Planting Week (Erastil)\n";
  }

  //Gozran (14-17)
  if(week == 14) {
    string = string + "Holidays:\n 7th of Gozran: Currentseve (Gozreh)\n ";
  }
  if(week == 15) {
    string = string + "Holidays:\n 15th of Gozran: Taxfest (Abadar)\n ";
  }
  if(week == 16 || week == 17) {
    string = string + "Holidays:\n 16th to 30th of Gozran: Wrights of Augustana (Andoran)\n ";
  }

  //Gozran/Densus
  if(week == 18) {
    string = string + "Holidays:\n 16th to 30th of Gozran: Wrights of Augustana (Andoran)\n 2nd to 3rd of Desnus: Ascendance Night (Norgorber)\n";

  //Densus (18-21)
  }
  if(week == 20) {
    string = string + "Holidays:\n 13th of Desnus: Old-Mage Day (Nantambu, Mwangi Expanse)\n";
  }
  if(week == 21) {
    string = string + "Holidays:\n 26th of Desnus: Goblin Flea Market (Andoran)\n";
  }

  //Sarenith (22-26)
  if(week == 22) {
    string = string + "Holidays:\n 3rd of Sarenith: Independence Day (Andoran)\n";
  }
  if(week == 23) {
    string = string + "Holidays:\n 10th of Sarenith: Burning Blades (Sarenrae)\n";
  }
  if(week == 25) {
    string = string + "Holidays:\n 21st of Sarenith: Talon Tag (Andoran), Summer Solstice, Ritual of Stardust (Desna), and Sunwrought Festival (Sarenrae)\n 24th of Sarenith, Goblin Flea Market (Andoran)\n";
  }

  //Erastus (27-30)
  if(week == 27) {
    string = string + "Holidays:\n 3rd of Erastus: Archerfeast (Erastil)\n";
  }
  if(week == 28) {
    string = string + "Holidays:\n 14th of Erastus: Founding Festival (Korvosa)\n 15th to 21st of Erastus: Kianidi Festival (Garundi)\n";
  }
  if(week == 29) {
    string = string + "Holidays:\n 17th of Erastus: Burning Night (Razmiran)\n 15th to 21st of Erastus: Kianidi Festival (Garundi)\n";
  }
  if(week == 30) {
    string = string + "Holidays:\n 28th of Erastus, Goblin Flea Market (Andoran)\n ";
  }

  //Arodus (31-35)
  if(week == 31) {
    string = string + "Holidays:\n 1st of Arodus: Inheritor's Ascendance (Iomedae)\n ";
  }
  if(week == 32) {
    string = string + "Holidays:\n 6th of Arodus: First Crusader Day (Mendev)\n 9th of Arodus: Day of Silenced Whispers (Ustalav)\n";
  }
  if(week == 33) {
    string = string + "Holidays:\n 16th of Arodus: Armasse (Aroden, Iomedae)\n";
  }
  if(week == 34) {
    string = string + "Holidays:\n 25th of Arodus: Silverglazer Sunday (Andoran)\n";
  }

  //Arodus/Rova
  if(week == 35) {
    string = string + "Holidays:\n 31st of Arodus: Leap Day\n 2nd of Rova: Silverglazer Sunday (Andoran)\n";
  }

  //Rova (36-39)
  if(week == 36) {
    string = string + "Holidays:\n 6th of Rova: Start of Classes (Acadamae, Arcanamirium, College of Mysteries, Clockwork Cathedral)\n";
  }
  if(week == 37) {
    string = string + "Holidays:\n 13th of Rova: Signing Day (Andoran, Cheliax, Galt, Isger)\n 16th to 30th of Rova: Autumnal Carpentry Court (Andoran)\n";
  }
  if(week == 38) {
    string = string + "Holidays:\n 19th of Rova: Day of Inheritor (Iomedae)\n 16th to 30th of Rova: Autumnal Carpentry Court (Andoran)\n";
  }
  if(week == 39) {
    string = string + "Holidays:\n 16th to 30th of Rova: Autumnal Carpentry Court (Andoran)\n Autumnal Equinox: Harvest Feast (Erastil)\n Autumnal Equinox: Swallowtail Festival (Desna)\n";
  }

  //Lamashan
  if(week == 40) {
    string = string + "Holidays:\n 6th of Ascendance Day (Iomedae)\n";
  }
  if(week == 41) {
    string = string + "Holidays:\n 8th of Lamashan: Harvest Feast\n";
  }
  if(week == 43) {
    string = string + "Holidays:\n 27th of Lamashan: Jestercap (Andoran, Druma, Taldor)\n";
  }
  if(week == 44) {
    string = string + "Holidays:\n 30th of Lamashan: Allbirth (Lamashtu)\n";
  }

  //Neth
  if(week == 45) {
    string = string + "Holidays:\n 5th of Neth: Independence Day (Galt)\n 8th of Neth: Abjurant Day (Nethys)\n";
  }
  if(week == 46) {
    string = string + "Holidays:\n 14th of Neth: Even-Tongued Day (Andoran, Cheliax, Galt)\n 18th of Neth: Evoking Day (Nethys)\n";
  }
  if(week == 47) {
    string = string + "Holidays:\n 23th of Neth: Seven Veils\n";
  }
  if(week == 48) {
    string = string + "Holidays:\n 28th of Neth: Transmutatum (Nethys)\n";
  }

  //Kuthona
  if(week == 50) {
    string = string + "Holidays:\n 10th to 16th of Kuthona: Winter Week\n 11th of Kuthona: Ascension Day (Cayden Cailean)\n";
  }
  if(week == 52) {
    string = string + "Holidays:\n 31st of Kuthona: Turning Day (Alesta)\n Winter Solstice: Crystalhue (Shelyn)\n Winter Solstice: Ritual of Stardust (Desna)\n";
  }

  //Add border
  string = string + border;
}

//Adds the moon status attachment to the string to be displayed.
function getMoon(){
  // New Moon
  if(moon == 1) {
    string = string + "<:new_moon:529421884299804692> New Moon\n\n";
  }
  // Waxing Cresent
  if(moon == 2) {
    string = string + "<:waxing_crescent_moon:529421976482349076> Waxing Cresent\n\n"
  }
  // First Quarter
  if(moon == 3) {
    string = string + "<:first_quarter_moon:529422288836231168> First Quarter\n\n"
  }
  // Waxing Gibbous
  if(moon == 4) {
    string = string + "<:waxing_gibbous_moon:529422456096686101> Waxing Gibbous\n\n"
  }
  // Full Moon
  if(moon == 5) {
    string = string + "<:full_moon:529422530839183370> Full Moon\n\n"
  }
  // Waning Gibbous
  if(moon == 6) {
    string = string + "<:waning_gibbous_moon:529422592721944586> Waning Gibbous\n\n"
  }
  // Last Quarter
  if(moon == 7) {
    string = string + "<:last_quarter_moon:529422691682222090> Last Quarter\n\n"
  }
  // Waning Cresent
  if(moon == 8) {
    string = string + "<:waning_crescent_moon:529422909543022612> Waning Cresent\n\n"
  }

}

//Get the weather forecast for this week.
function getForecast(){
  var i;
  string = ":\n===================================\n";
  for( i = 1; i < 8; i++) {
    string = string + "**Day:** " + i + "\n";
    string2 = "";
    /*Winter Season
    Lowest low: -20 F Highest low: 20 F
    Lowest High: 0 F Highest high: 40 F
    Winds speeds, Low: 0 High: 10
    Precipitation types: Rain Hail Snow*/
    if(season == 1) {
      //Get high
      high = Math.floor(Math.random() * 40);

      //Get Low
      low = Math.floor(Math.random() * 40) - 20;
      while(low == high || low >= high || (high - low) > 20) {
        low = Math.floor(Math.random() * 40) - 20;
      }

      //Get Wind speeds
      wind = Math.floor(Math.random() * 10);
    }

    /*Spring season
    Lowest low: 25 F Highest low: 45 F
    Lowest High: 30 F Highest high: 60 F
    Winds speeds, Low: 0 High: 10
    Precipitation types: Rain Fog Hail*/
    if(season == 2) {
      //Get high
      high = Math.floor(Math.random() * 30) + 30;

      //Get Low
      low = Math.floor(Math.random() * 20) + 25;
      while(low == high || low >= high || (high - low) > 20) {
        low = Math.floor(Math.random() * 20) + 25;
      }

      //Get Wind speeds
      wind = Math.floor(Math.random() * 10);
    }

    /*Summer season
    Lowest low: 40 F Highest low: 75 F
    Lowest High: 60 F Highest high: 90  F
    Winds speeds, Low: 0 High: 10
    Precipitation types: Rain Fog Hail*/
    if(season == 3) {
      //Get high
      high = Math.floor(Math.random() * 30) + 60;

      //Get Low
      low = Math.floor(Math.random() * 35) + 40;
      while(low == high || low >= high || (high - low) > 20) {
        low = Math.floor(Math.random() * 35) + 40;
      }

      //Get Wind speeds
      wind = Math.floor(Math.random() * 10);
    }

    /*Autumn season
    Lowest low: 25 F Highest low: 50 F
    Lowest High: 40 F Highest high: 70 F
    Winds speeds, Low: 0 High: 10
    Precipitation types: Rain Fog Hail*/
    if(season == 4) {
      //Get high
      high = Math.floor(Math.random() * 30) + 40;

      //Get Low
      low = Math.floor(Math.random() * 25) + 25;
      while(low == high || low >= high || (high - low) > 20) {
        low = Math.floor(Math.random() * 25) + 25;
      }

      //Get Wind speeds
      wind = Math.floor(Math.random() * 10);
    }

    //Get weather type
    getWeather();

    //output
    string = string + "**Temperature:** High " + high + "°F(" + Math.round(((high-32)*(5/9))) + "°C)/Low " + low + "°F(" + Math.round(((low-32)*(5/9))) + "°C)\n";
    string = string + "**Wind Speed:** " + wind  + " mph (" + Math.round((wind*1.6)) + " kph)\n";
    string = string + string2 + "===================================\n";
  }
  channel2 = client.channels.get("475087626597302273");
  channel2.send(string);
  if(string3 !== "") {
    channel2.send(string3);
    string3 = "";
  }
  //console.log(string);
}

//Gets the weather type
function getWeather(){
  //Weather types: 1 (Normal) 60%, 2 (Occurance) 40%
  //Occurance Types: 1 (Inclement) 70%, 2 (Storm) 15%, 3 (Powerful Storm) 10%, 4 (BAD) 5%

  //Normal weather
  if( Math.floor(Math.random() * 100) + 1 <= 80 ) {
    string = string + "**Weather Description:** Normal weather\n";
  }
  //Occurance
  else {
    var percentage = Math.floor(Math.random() * 100) + 1;
    //Inclement
    if(percentage <= 70) {
      string = string + "**Weather Description:** Inclement weather\n";
      //Check for type by season
      percentage = Math.floor(Math.random() * 100) + 1;
      //Winter
      if(season == 1) {
        //Snow
        if(percentage <= 60) {
          string2 = string2 + "**Precipitation:** " + (Math.floor(Math.random() * 10) + 1) + " hour(s) of snow producing " + (Math.floor(Math.random() * 12) + 1) + " inch(es)\n";
        }
        //Hail
        if(percentage >= 61 && percentage <= 90) {
          high = high + 2;
          low = low + 2;
          string2 = string2 + "**Precipitation:** " + (Math.floor(Math.random() * 10) + 1) + " hour(s) of hail\n";
        }
        //Rain
        if(percentage >= 91 && percentage <= 100) {
          high = high + 5;
          low = low + 5;
          string2 = string2 + "**Precipitation:** " + (Math.floor(Math.random() * 10) + 1) + " hour(s) of rain\n";
        }
      }
      //Spring
      if(season == 2) {
        //Rain
        if(percentage <= 70) {
          high = high - 5;
          low = low - 5;
          string2 = string2 + "**Precipitation:** " + (Math.floor(Math.random() * 10) + 1) + " hour(s) of rain\n";
        }
        //Fog
        if(percentage >= 71 && percentage <= 90) {
          high = high - 2;
          low = low - 2;
          string2 = string2 + "**Precipitation:** " + (Math.floor(Math.random() * 10) + 1) + " hour(s) of fog\n";
        }
        //Hail
        if(percentage >= 91 && percentage <= 100) {
          high = high - 3;
          low = low - 3;
          string2 = string2 + "**Precipitation:** " + (Math.floor(Math.random() * 10) + 1) + " hour(s) of hail\n";
        }
      }
      //Summer
      if(season == 3) {
          //Rain
          if(percentage <= 60) {
            high = high - 5;
            low = low - 5;
            string2 = string2 + "**Precipitation:** " + (Math.floor(Math.random() * 10) + 1) + " hour(s) of rain\n";
          }
          //Fog
          if(percentage >= 61 && percentage <= 100) {
            high = high - 2;
            low = low - 2;
            string2 = string2 + "**Precipitation:** " + (Math.floor(Math.random() * 10) + 1) + " hour(s) of fog\n";
          }
      }
      //Autumn
      if(season == 4) {
          //Rain
          if(percentage <= 70) {
            high = high - 5;
            low = low - 5;
            string2 = string2 + "**Precipitation:** " + (Math.floor(Math.random() * 10) + 1) + " hour(s) of rain\n";
          }
          //Fog
          if(percentage >= 71 && percentage <= 90) {
            high = high - 2;
            low = low - 2;
            string2 = string2 + "**Precipitation:** " + (Math.floor(Math.random() * 10) + 1) + " hour(s) of fog\n";
          }
          //Hail
          if(percentage >= 91 && percentage <= 100) {
            high = high - 3;
            low = low - 3;
            string2 = string2 + "**Precipitation:** " + (Math.floor(Math.random() * 10) + 1) + " hour(s) of hail\n";
          }
      }
    }
    //Storm
    else if(percentage <= 71 && percentage <= 86) {
      string = string + "**Weather Description:** Storms\n";
      //Winter
      if(season == 1) {
        high = high - 3;
        low = low - 3;
        wind = wind + 1;
        string2 = string2 + "**Precipitation:** Snowstorm producing " + (Math.floor(Math.random() * 10) + 6) + " inch(es)\n";
      }
      //Spring
      if(season == 2) {
        high = high - 5;
        low = low - 5;
        wind = wind + 5;
        string2 = string2 + "**Precipitation:** " + (Math.floor(Math.random() * 10) + 1) + " hour(s) of thunderstorms and rain\n";
      }
      //Summer
      if(season == 3) {
        high = high - 4;
        low = low - 4;
        wind = wind + 3;
        string2 = string2 + "**Precipitation:** " + (Math.floor(Math.random() * 10) + 1) + " hour(s) of thunderstorms and rain\n";
      }
      //Autumn
      if(season == 4) {
        high = high - 4;
        low = low - 4;
        wind = wind + 3;
        string2 = string2 + "**Precipitation:** " + (Math.floor(Math.random() * 10) + 1) + " hour(s) of thunderstorms and rain\n";
      }
    }
    //Powerful Storm
    else if(percentage <= 87 && percentage <= 98) {
      string = string + "**Weather Description:** Powerful Storms\n";
      //Winter
      if(season == 1) {
        high = high - 6;
        low = low - 6;
        wind = wind + 2;
        string2 = string2 + "**Precipitation:** Powerful snowstorm producing " + (Math.floor(Math.random() * 15) + 5) + " inch(es)\n";
      }
      //Spring
      if(season == 2) {
        high = high - 7;
        low = low - 7;
        wind = wind + 7;
        string2 = string2 + "**Precipitation:** " + (Math.floor(Math.random() * 10) + 1) + " hour(s) of heavy thunderstorms and rain\n";
      }
      //Summer
      if(season == 3) {
        high = high - 6;
        low = low - 6;
        wind = wind + 5;
        string2 = string2 + "**Precipitation:** " + (Math.floor(Math.random() * 10) + 1) + " hour(s) of heavy thunderstorms and rain\n";
      }
      //Autumn
      if(season == 4) {
        high = high - 6;
        low = low - 6;
        wind = wind + 4;
        string2 = string2 + "**Precipitation:** " + (Math.floor(Math.random() * 10) + 1) + " hour(s) of heavy thunderstorms and rain\n";
      }
    }
    //BAD
    else if(percentage <= 99 && percentage <= 100) {
      string = string + "**Weather Description:** Natural Disaster\n";
      getBAD();
    }
  }
}

//Deals with the really bad weather occurances
function getBAD(){
  //Percentage Generator
  var percentage = Math.floor(Math.random() * 100) + 1;
  //console.log(percentage);
  //Winter
  if(season == 1) {
    //Stupidly High Snow Fall
    high = high - 6;
    low = low - 6;
    wind = wind + 20;
    string2 = string2 + "**Natural Disaster:** Massive snowstorm producing " + (Math.floor(Math.random() * 20) + 20) + " inch(es) of snow\n";
    string3 = "@everyone, A massive snowstorm has occured, check for damage to your property. Also good luck opening the door.\n";
  }
  //Spring
  if(season == 2) {
    //Hurricane
    if(percentage <= 50) {
      high = high - 8;
      low = low - 8;
      wind = wind + Math.floor(Math.random() * 30) + 70;
      string2 = string2 + "**Natural Disaster:** A hurricane sweeps through causing heavy rain and devastating winds.\n";
      string3 = "@everyone, A hurricane has occured, check for damage to your property. Get ready to pick up lots of fallen trees and branches.\n";
    }
    //Torrential rain
    else {
      high = high - 6;
      low = low - 6;
      wind = wind + 8;
      string2 = string2 + "**Natural Disaster:** Torrential rain floods the streets.\n";
      string3 = "@everyone, Torrential rains have swept through Siavenian. Hope you built above sea level.\n";
    }
  }
  //Summer
  if(season == 3) {
    //Tornado
    if(percentage <= 50) {
      high = high - 3;
      low = low - 3;
      wind = wind +  Math.floor(Math.random() * 30) + 70;
      string2 = string2 + "**Natural Disaster:** A tornado rips through causing devastating winds.\n";
      string3 = "@everyone, A tornado has occured, check for damage to your property. Hope you didn't leave anything outside.\n";
    }
    //record heat
    else {
      high = high + 30;
      low = low + 30;
      string2 = string2 + "**Heat Wave:** A heat wave spreads over Siavenian.\n";
      string3 = "@everyone, A heat wave has occured. Make sure you water your plants throughly.\n";
    }
  }
  //Autumn
  if(season == 4) {
    //Tornado
    if(percentage <= 50) {
      high = high - 5;
      low = low - 5;
      wind = wind +  Math.floor(Math.random() * 30) + 70;
      string2 = string2 + "**Natural Disaster:** A tornado rips through causing devastating winds.\n";
      string3 = "@everyone, A tornado has occured, check for damage to your property. Hope you didn't leave anything outside.\n";
    }
  }
}

//Get last values of time and update accordingly.
function getLastValues(){
  //Get last message in time-tracker.
  var channel = client.channels.get(id);
  channel.fetchMessages({ limit:1 }).then(messages => {
    var last = messages.first().content.split("\n");

    //Get and set week value.
    var newWeek = parseInt(last[2].split("/")[0]) + 1;
    if(newWeek > 52) {
      week = 1;
    }
    else {
      week = newWeek;
    }
    //console.log(week);

    //Get and set moon value.
    var newMoon = last[6].split(" ")[0];
    //console.log(newMoon);
    if(newMoon === ":new_moon:") {
      moon = 2;
    }
    if(newMoon === ":waxing_crescent_moon:") {
      moon = 3;
    }
    else if(newMoon === ":first_quarter_moon:") {
      moon = 4;
    }
    else if(newMoon === ":waxing_gibbous_moon:") {
      moon = 5;
    }
    else if(newMoon === ":full_moon:") {
      moon = 6;
    }
    else if(newMoon === ":waning_gibbous_moon:") {
      moon = 7;
    }
    else if(newMoon === ":last_quarter_moon:") {
      moon = 8;
    }
    else if(newMoon === ":waning_crescent_moon:") {
      moon = 1;
    }
    //console.log(moon);
  }).catch(err => {
    console.log(err);
  });

}
