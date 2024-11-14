export class Place {
    constructor(id, raion, oras, strada) {
      this.id = id;
      this.raion = raion;
      this.oras = oras;
      this.strada = strada;
    }
  }
  
  export class Organizer {
    constructor(id, start_date, nume, domeniu) {
      this.id = id;
      this.start_date = start_date;
      this.nume = nume;
      this.domeniu = domeniu;
    }
  }
  
  export class Event {
    constructor(id, titlu, descriere, data, tip, ora, organizer, place) {
      this.id = id;
      this.titlu = titlu;
      this.descriere = descriere;
      this.data = data;
      this.tip = tip;
      this.ora = ora;
      this.organizer = organizer;
      this.place = place;
    }
  }
  