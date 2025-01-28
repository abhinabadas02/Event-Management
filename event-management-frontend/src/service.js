
class service {
  static logout() {
    localStorage.removeItem("token");
  }

}
export default service;
