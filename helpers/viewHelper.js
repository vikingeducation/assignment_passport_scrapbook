const ViewHelper = {
  displayName: user => {
    return user.googleDisplayName ||
           user.githubDisplayName ||
           user.linkedinDisplayName ||
           user.instagramDisplayName ||
           user.twitterDisplayName;
  },

  displayDate: date => {
    date = new Date(date);
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekday = weekdays[date.getDay()];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    let hour = date.getHours();
    let timeIdentifier = 'am';

    if (hour > 12) {
      hour -= 12;
      timeIdentifier = 'pm';
    } else if (hour === 0) {
      hour = 12;
    }

    const minutes = date.getMinutes();

    return `${ weekday } ${ month }/${ day } ${ hour }:${ minutes }${ timeIdentifier }`;
  },

  any: item => {
    return item ? item.length : 0;
  }
};

module.exports = ViewHelper;
