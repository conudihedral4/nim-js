class Item {
  //PImage icon;     // image object
  //var x;           // x-coordinate
  //var y;           // y-coordinate
  //var width;       // display width
  //var height;      // display height
  //var clicked; // has item been clicked?

  /* Create new icon with specified png file
  constructor(filename, x, y, width, height) {
    this.icon = loadImage(filename);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.clicked = false;
  }
  */

  /* Use default png file */
  constructor(x, y, width, height) {
    this.icon = loadImage("data/donut_full.png");
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.clicked = false;
  }

  display() {
    if (!clicked) {
      image(icon, x, y, width, height);
    }
  }

  animate() {
    this.icon = loadImage("data/donut_onebite.png");
    delay(300);
    redraw();

    this.icon = loadImage("data/donut_twobites.png");
    delay(300);
    redraw();

    this.clicked = true;
  }
}
