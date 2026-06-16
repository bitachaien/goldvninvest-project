<?php
declare(ticks=1);

namespace App\Services\ParallelService;

use Closure;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Artisan;
use App\Exceptions\ParallelSocketCreateException;
use Laravel\SerializableClosure\SerializableClosure;

class ParallelService
{
    private array $childrenSockets = [];
    private array $closures        = [];
    private array $returnValues    = [];
    private array $classMethods    = [];

    public function __construct(){}

    public function createSocket(): array|bool
    {
        return stream_socket_pair(
            STREAM_PF_UNIX,
            STREAM_SOCK_STREAM,
            STREAM_IPPROTO_IP
        );
    }

    public function add(string $returnValueKey, Closure $callback): self
    {
        if(
            array_key_exists(
                $returnValueKey, 
                $this->returnValues["closures"] ?? []
            )
        ) return $this;

        $this->returnValues["closures"][$returnValueKey] = null;
        $this->closures[] = $callback;
        return $this;
    }

    public function addClassMethod(string $returnValueKey, string $class, string $method, ...$params): self
    {
        if(
            array_key_exists(
                $returnValueKey, 
                $this->returnValues["classMethods"] ?? []
            )
        ) return $this;
  
        $this->returnValues["classMethods"][$returnValueKey] = null;
        $this->classMethods[] = [ $class, $method, $params ];

        return $this;
    }

    public function setPayload(string $closuresAndReturnValueKeys):self
    {
        $closuresAndReturnValueKeys = unserialize(base64_decode($closuresAndReturnValueKeys));
        $this->closures     = $closuresAndReturnValueKeys["closures"]        ?? [];
        $this->returnValues = $closuresAndReturnValueKeys["returnValueKeys"] ?? [];
        $this->classMethods = $closuresAndReturnValueKeys["classMethods"]    ?? [];
        return $this;
    }

    public function getValue(): array
    {
        return $this->returnValues;
    }

    public function fire(): mixed
    {
        if(!$this->returnValues) return null;

        $serializePassableArgument["returnValueKeys"] = $this->returnValues;

        if($this->closures){
            $closures = array_map(function($closure){
                return new SerializableClosure($closure);
            }, $this->closures);
            $serializePassableArgument["closures"] = $closures;
        }

        if($this->classMethods){
            $serializePassableArgument["classMethods"] = $this->classMethods;
        }

        $serializePassableArgument = base64_encode(serialize($serializePassableArgument));
        exec("cd ../ && php artisan parallel:process \"$serializePassableArgument\"", $output, $returnStatus);

        if($returnStatus === 0 && isset($output[0]))
            return unserialize(base64_decode($output[0]));
        return null;
    }

    public function process()
    {
        $payloads = [
            "closures"     => $this->closures,
            "classMethods" => $this->classMethods
        ];

        $masterProcess   = false;

        foreach ($payloads as $key => $value) {
            $returnValueKeys   = match($key){
                "closures"     => array_keys($this->returnValues["closures"]),
                "classMethods" => array_keys($this->returnValues["classMethods"])
            };

            $length = count($value) - 1;
            for($i=0; $i <= $length; $i++){
                $returnValueKey = $returnValueKeys[$i];
                $processAble    = match($key){
                    "closures" => $value[$i]->getClosure(),
                    "classMethods" => $value[$i]
                };

                $socketPair = $this->createSocket();
                if(!is_array($socketPair))
                throw new ParallelSocketCreateException;

                $pid = $this->openCloneProcess();
                if ($pid == -1) {
                    dd("process as programed");
                }else if($pid === 0){
                    $this->childProcess(
                        processAble   : $processAble,
                        socketPair    : $socketPair,
                        returnValueKey: $returnValueKey,
                        processType   : $key
                    );
                    exit(0);
                }else{
                    $masterProcess = true;
                    fclose($socketPair[1]);
                    $this->childrenSockets[$pid] = $socketPair[0];
                }
            }
        }
 
        // $this->waitCloneProcess();
        if($masterProcess)
        $this->collectReturnValue();
    }

    private function childProcess(mixed $processAble, array $socketPair, string $returnValueKey, string $processType)
    {
        if($processType == "closures")
            $this->processCallable(
                callable      : $processAble,
                socket        : $socketPair,
                returnValueKey: $returnValueKey
            );

        if($processType == "classMethods")
            $this->processClassMethod(
                socket        : $socketPair,
                returnValueKey: $returnValueKey,
                class         : $processAble[0],
                method        : $processAble[1],
                params        : $processAble[2],
            );

        exit(0);
    }

    private function processClassMethod(array $socket, string $returnValueKey, string $class, string $method, array $params)
    {
        $this->processAndSendResult(
            socket        : $socket,
            callable      : fn() => app($class)->{$method}(...$params),
            returnValueKey: $returnValueKey
        );
        exit(0);
    }

    private function openCloneProcess(): int
    {
        return pcntl_fork();
    }
   
    private function waitCloneProcess(&$status): int
    {
        return pcntl_wait($status);
    }

    private function processCallable(Closure $callable, array $socket, string $returnValueKey)
    {
        // try {
        //     fclose($socket[0]);
        //     $value = serialize([
        //         "returnKey" => $returnValueKey,
        //         "value" => $callable()
        //     ]);
        //     $data = base64_encode($value);
        //     $length = strlen($data);

        //     fwrite($socket[1], pack('N', $length));

        //     $written = 0;
        //     while ($written < $length) {
        //         $n = fwrite($socket[1], substr($data, $written));
        //         if ($n === false) {
        //             storeLog("Sending data failed", "error");
        //             exit(0);
        //         }
        //         $written += $n;
        //     }

        //     fclose($socket[1]);
        //     exit(0);
        // } catch (\Exception $e) {
        //     storeLog(processExceptionMsg($e), "error");
        //     exit(0);
        // }

        $this->processAndSendResult(
            socket        : $socket,
            callable      : $callable,
            returnValueKey: $returnValueKey
        );
        exit(0);
    }

    private function processAndSendResult(array $socket, Closure $callable, string $returnValueKey): mixed
    {
        try{

            // fclose(STDOUT);
            // fclose(STDERR);
            // fclose(STDIN);

            // pcntl_signal(SIGALRM, function() {
            //     Log::info("Timeout reached, killing child\n");
            //     posix_kill(posix_getpid(), SIGKILL);
            // });
            // pcntl_alarm(5); 

            // if($returnValueKey == "testInteger"){
            //     sleep(5);
            //     echo "from 1 child";
            // }
            // if($returnValueKey == "integer"){
            //     sleep(1);
            //     echo "from 2 child";
            // }

            fclose($socket[0]);
            $value = serialize([
                "returnKey" => $returnValueKey,
                "value" => $callable()
            ]);
            $data = base64_encode($value);
            $length = strlen($data);

            fwrite($socket[1], pack('N', $length));

            $written = 0;
            while ($written < $length) {
                $n = fwrite($socket[1], substr($data, $written));
                if ($n === false) {
                    storeLog("Sending data failed", "error");
                    exit(0);
                }
                $written += $n;
            }

            fclose($socket[1]);
            exit(0);
        } catch (\Exception $e) {
            storeLog(processExceptionMsg($e), "error");
            exit(0);
        }
    }

    private function collectReturnValue()
    {

        $this->returnValues = [];
        foreach ($this->childrenSockets as $pid => $socket) {
            Log::info("start");
            $dataLength = fread($socket, 4);
            Log::info($dataLength);
            if (strlen($dataLength) !== 4) {
                storeLog("Receive data length not 4", "error");
                exit(0);
            }


            $length = unpack('N', $dataLength)[1];

            $received = '';
            while (strlen($received) < $length) {
                $chunk = fread($socket, $length - strlen($received));
                if ($chunk === false) {
                    storeLog("Receiving chunk data failed", "error");
                    exit(0);
                }
                $received .= $chunk;
            }

            if($receivedData = unserialize(base64_decode($received)))
                $this->returnValues[$receivedData["returnKey"]] = $receivedData['value'];

            fclose($socket);
            pcntl_waitpid($pid, $status);
        }

        $this->childrenSockets = [];
    }

}