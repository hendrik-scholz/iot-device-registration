import chai from "chai";
import chaiExclude from "chai-exclude";
import axios from "axios";
chai.use(chaiExclude);

const expect = chai.expect;

describe("API", () => {
  const baseUrl = "http://127.0.0.1:3000";

  describe("HTTP", () => {
    it("should return a list of all devices", (done) => {
      axios
        .get(`${baseUrl}/devices`)
        .then((response) => {
          expect(response.status).to.equal(200);
          done();
        })
        .catch((error) => done(error));
    });

    it("should return a device with a certain UUID", (done) => {
      axios
        .get(`${baseUrl}/devices/50b56281-1d81-4db1-b739-1ea234d16b12`)
        .then((response) => {
          expect(response.status).to.equal(200);
          done();
        })
        .catch((error) => done(error));
    });

    it("should return a list of all devices within a certain geofence", (done) => {
      axios
        .get(
          `${baseUrl}/devices/geofence?lat=65.065085&lng=-140.43114&radius=500000`
        )
        .then((response) => {
          expect(response.status).to.equal(200);
          done();
        })
        .catch((error) => done(error));
    });
  });
});
