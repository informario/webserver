use std::net::TcpListener;
use std::net::TcpStream;
use std::io::BufReader;
use std::io::prelude::*;
use std::fs;

/*Un bind a una dirección genera un listener
un listener tiene un iterador incoming, de varios streams
*/


fn main() {
    let listener = match TcpListener::bind("192.168.0.78:8996"){
        Ok(s) => s,
        Err(e) => {
            println!("{}", e);
            return;
        }
    };

    for stream in listener.incoming() {
        let stream = stream.unwrap();
        handle_connection(stream);
    }
}


fn handle_connection(mut stream: TcpStream) {
    
    let buf_reader = BufReader::new(&mut stream);
    let request_line = buf_reader.lines().next();
    let request_line = match request_line {
        Some(s) => s,
        None => return,
    };
    let request_line = match request_line {
        Ok(s) => s,
        Err(e) => {
            println!("{}", e);
            return;
        }
    };
    let (status_line, filename) = if request_line == "GET / HTTP/1.1" {
        ("HTTP/1.1 200 OK", "hello.html")
    } else {
        ("HTTP/1.1 404 NOT FOUND", "404.html")
    };

    let contents = match fs::read_to_string(filename){
        Ok(s) => s,
        Err(e) => {
            println!("{}", e);
            return;
        }
    };
    let length = contents.len();

    let response =
        format!("{status_line}\r\nContent-Length: {length}\r\n\r\n{contents}");

    stream.write_all(response.as_bytes()).unwrap();
}
