use std::net::TcpListener;
use std::net::TcpStream;
use std::io::BufReader;
use std::io::prelude::*;
use std::fs;
use std::env;

/*Un bind a una dirección genera un listener
un listener tiene un iterador incoming, de varios streams
*/


fn main() {
    let args:Vec<String> = env::args().collect();
    if args.len() <2{
        return
    }
    let listener = match TcpListener::bind(&args[1]){
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
    println!("END");
}

fn handle_connection(mut stream: TcpStream) {
    
    let buf_reader = BufReader::new(&mut stream);
    let mut lines = buf_reader.lines();
    let request_line = lines.next();
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
    let first_space_index = match request_line.find(' ') {
        Some(s)=>s,
        None=>{
            println!("No spaces found in request line");
            return;
        }
    };
    let second_space_index = match request_line[first_space_index+1..].find(' ') {
        Some(s)=>s+first_space_index+1,
        None=>{
            println!("Not enough spaces found in request line");
            return;
        }
    };

    let method:&str = &request_line[0..first_space_index];
    let address:&str = &request_line[first_space_index+1..second_space_index];
    let http_version:&str = &request_line[second_space_index..];
    //println!("{} {}",first_space_index,second_space_index);
    //println!("method:{}, address:{}, http_version:{}", method, address, http_version);s

    let (status_line, filename) = match method{
        "GET"=>{
            ("HTTP/1.1 200 OK", format!("website{}",address))
        },
        "POST"=>{
            println!("address:{}, http_version:{}, method:POST", address, http_version);
            ("HTTP/1.1 200 OK", "received".to_string())
            
        },
        _=>{
            println!("{}",request_line);
            ("HTTP/1.1 404 NOT FOUND", String::from("website/404.html"))
        }
    };    
    if (method=="GET"){
        let contents = match fs::read_to_string(&filename){
            Ok(s) => s,
            Err(_e) => {
                println!("failed filename: {}", filename);
                match fs::read_to_string("website/404.html"){
                    Ok(s) =>s,
                    Err(e)=>{
                        println!("{}", e);
                        return
                    }
                }
            }
        };
        let length = contents.len(); 
        let response =
            format!("{status_line}\r\nContent-Length: {length}\r\n\r\n{contents}");
        stream.write_all(response.as_bytes()).unwrap();
    }
    else if method=="POST"{
        

        let contents = fs::read_to_string("website/registro/registrado.html").unwrap();
        let length = contents.len(); 
        let response =
            format!("{status_line}\r\nContent-Length: {length}\r\n\r\n{contents}");
        stream.write_all(response.as_bytes()).unwrap();
    }

}
