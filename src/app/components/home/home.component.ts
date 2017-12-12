import { Component, OnInit, Pipe } from "@angular/core";
import * as fs from "fs";
import * as dir from "node-dir";
import { single, multi } from "./data";
import { Router } from "@angular/router";
import { remote,ipcRenderer} from "electron";
let { dialog } = remote;
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  data: any = [];
  total: any = 0;
  isFilesLoaded: boolean = false;
  single: any[];
  multi: any[];
  result: any[];

  view: any[] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = "Country";
  showYAxisLabel = true;
  yAxisLabel = "Population";

  colorScheme = {
    domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"]
  };

  // line, area
  autoScale = true;
  constructor(private router: Router) {
    this.multi = [
      {
        name: "2",
        value: 8940000
      },
      {
        name: "3",
        value: 5000000
      },
      {
        name: "4",
        value: 7200000
      }
    ];
  }

  onSelect(event) {
    console.log(event);
  }
  countWords(s) {
    s = s.replace(/(^\s*)|(\s*$)/gi, "");
    s = s.replace(/[ ]{2,}/gi, " ");
    s = s.replace(/\n /, "\n");
    return s.split(" ").length;
  }
  readFilesFromDir() {
    this.total = 0;
    // this.multi = [];
    const that = this;

    this.isFilesLoaded = false;
    dir.readFiles(
      "D:/WORK/books/",
      {
        match: /.txt$/,
        exclude: /^\./
      },
      function(err, content, filename, next) {
        // tslint:disable-next-line:curly
        if (err) throw err;
        const name = filename.split("\\")[filename.split("\\").length - 1];
        // _thisdir.txt
        // if(name.includes('_thisdir.txt')>0){

        // }
        if (!name.includes("thisdir.txt")) {
          that.total++;
          that.multi.push({
            name: fs.statSync(filename).size + "",
            value: that.countWords(content)
          });
          that.data.push({
            name: name,
            size: fs.statSync(filename).size,
            text: content,
            count: that.countWords(content)
          });
        }
        next();
      },
      function(err, files) {
        // tslint:disable-next-line:curly
        if (err) throw err;
        console.log("finished reading files:");
        that.isFilesLoaded = true;
        that.router.navigate(['chart'])
      }
    );
  }
  checkFolder(){
    console.log('ssssssss');
    dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']},filePaths => console.log(filePaths))
  }
  ngOnInit() {
    // this.readFilesFromDir();
  }
}
